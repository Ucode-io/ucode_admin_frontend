import {Box, Button, Menu, MenuItem, TextField} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Container, Draggable} from "react-smooth-dnd";
import {getColumnIcon} from "../../table-redesign/icons";
import DrawerFieldGenerator from "./ElementGenerator/DrawerFieldGenerator";
import {Flex, Text} from "@chakra-ui/react";
import {Check} from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {isEqual} from "lodash";
import {Controller} from "react-hook-form";
import {useParams} from "react-router-dom";
import layoutService from "../../../services/layoutService";
import {applyDrag} from "../../../utils/applyDrag";
import "./style.scss";
import {store} from "../../../store";
import {useSelector} from "react-redux";
import { FIELD_TYPES } from "../../../utils/constants/fieldTypes";

function DrawerFormDetailPage({
  control,
  watch,
  data,
  layout,
  fieldsMap,
  selectedTab = {},
  selectedRow,
  selectedTabIndex = 0,
  handleMouseDown,
  projectInfo,
  setFormValue = () => {},
  reset = () => {},
  errors,
}) {
  const { i18n } = useTranslation();
  const { tableSlug } = useParams();
  const [dragAction, setDragAction] = useState(false);
  const [activeLang, setActiveLang] = useState();
  const auth = store.getState().auth;
  const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
  const languages = useSelector((state) => state.languages.list)?.map(
    (el) => el.slug
  );

  const slugSplit = (slug) => {
    const parts = slug.split("_");
    return parts[parts.length - 1];
  };

  const [sections, setSections] = useState(
    data?.tabs?.[selectedTabIndex]?.sections || []
  );

  useEffect(() => {
    setSections(data?.tabs?.[0]?.sections || []);
  }, [data]);

  const onDrop = (secIndex, dropResult) => {
    if (!dropResult.removedIndex && !dropResult.addedIndex) return;

    const newSections = [...sections];
    newSections[secIndex].fields = applyDrag(
      newSections[secIndex].fields,
      dropResult
    );

    setSections(newSections);
    updateCurrentLayout(newSections);
  };

  const updateCurrentLayout = (newSections) => {
    const updatedTabs = layout.tabs.map((tab, index) =>
      index === selectedTabIndex
        ? {
            ...tab,
            sections: newSections,
            attributes: {
              ...tab?.attributes,
            },
          }
        : tab
    );

    const currentUpdatedLayout = {
      ...layout,
      tabs: updatedTabs,
    };

    layoutService.update(currentUpdatedLayout, tableSlug);
  };

  useEffect(() => {
    if (selectedRow?.IS_NO_DATE || selectedRow?.IS_NEW) {
      setFormValue(
        selectedRow?.FROM_DATE_SLUG,
        selectedRow?.[selectedRow?.FROM_DATE_SLUG]
      );
      setFormValue(
        selectedRow?.TO_DATE_SLUG,
        selectedRow?.[selectedRow?.TO_DATE_SLUG]
      );
    }
    setFormValue(
      "attributes.layout_heading",
      selectedTab?.attributes?.layout_heading
    );
  }, [selectedTab, selectedRow]);

  useEffect(() => {
    if (!data?.tabs?.[0]?.sections) return;

    const updatedSections = data.tabs[0].sections.map((section) => ({
      ...section,
      fields: section?.fields?.filter(
        (el) => el?.slug !== watch("attributes.layout_heading") && el?.id
      ),
    }));

    setSections((prevSections) =>
      isEqual(prevSections, updatedSections) ? prevSections : updatedSections
    );
  }, [data, watch("attributes.layout_heading")]);

  const getFieldLanguageLabel = (el) => {
    console.log({ el });
    if (el?.type === FIELD_TYPES.LOOKUP || el?.type === FIELD_TYPES.LOOKUPS) {
      return el?.attributes?.[`label_${i18n?.language}`];
    }
    if (el?.enable_multilanguage) {
      return el?.attributes?.show_label
        ? `${el?.label} (${activeLang ?? slugSplit(el?.slug)})`
        : el?.attributes?.[`label_${i18n?.language}`];
    } else {
      if (el?.show_label === false) return "";
      else
        return el?.attributes?.[`label_${i18n.language}`] || el?.label || " ";
    }
  };

  const isMultiLanguage = useMemo(() => {
    const allFields = [];
    selectedTab?.sections?.map((section) => {
      return section?.fields?.map((field) => {
        return allFields.push(field);
      });
    });
    return !!allFields.find((field) =>
      field?.enable_multilanguage
        ? field?.enable_multilanguage
        : field?.attributes?.enable_multilanguage === true
    );
  }, [selectedTab]);

  useEffect(() => {
    if (isMultiLanguage) {
      setActiveLang(projectInfo?.language?.[0]?.short_name);
    }
  }, [isMultiLanguage, projectInfo]);

  const filterFields = (field) => {
    const slugParts = field?.slug?.split("_");
    const lastPart = slugParts?.[slugParts.length - 1];

    const isLangSpecific = languages.includes(lastPart);

    if (!isLangSpecific) {
      return true;
    }
    const lang = activeLang ?? i18n?.language;

    return lastPart === lang;
  };

  return (
    <>
      <Box
        mt="10px"
        sx={{ height: "calc(100vh - 44px)" }}
        pb={"10px"}
        overflow={"auto"}
      >
        {isMultiLanguage && (
          <div className={"language"}>
            {projectInfo?.language?.map((lang) => (
              <Button
                className={activeLang === lang?.short_name && "active"}
                onClick={() => setActiveLang(lang?.short_name)}
              >
                {lang?.name}
              </Button>
            ))}
          </div>
        )}

        <HeadingOptions
          selectedRow={selectedRow}
          watch={watch}
          control={control}
          fieldsMap={fieldsMap}
          selectedTab={selectedTab}
          setFormValue={setFormValue}
        />

        {sections?.map((section, secIndex) => (
          <Box
            sx={{
              margin: "8px 0 0 0",
            }}
            key={secIndex}
          >
            <Container
              behaviour="contain"
              style={{
                width: "100%",
              }}
              onDragStart={() => setDragAction(true)}
              onDragEnd={() => setDragAction(false)}
              dragHandleSelector=".drag-handle"
              dragClass="drag-item"
              lockAxis="y"
              onDrop={(dropResult) => onDrop(secIndex, dropResult)}
            >
              {section?.fields
                ?.filter((el) => filterFields(el))
                .map((field, fieldIndex) => (
                  <Draggable
                    className={Boolean(defaultAdmin) ? "drag-handle" : ""}
                    key={field?.id ?? fieldIndex}
                  >
                    <Box
                      className={dragAction ? "rowColumnDrag" : "rowColumn"}
                      display="flex"
                      alignItems="center"
                      {...(Boolean(field?.type === "MULTISELECT")
                        ? { minHeight: "30px" }
                        : { height: "34px" })}
                      py="8px"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={"space-between"}
                        padding="5px"
                        borderRadius={"4px"}
                        width="170px"
                        sx={{
                          "&:hover": {
                            backgroundColor: "#F7F7F7",
                          },
                        }}
                      >
                        <Box
                          width="18px"
                          height="16px"
                          mr="8px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{ color: "#787774" }}
                        >
                          <span className="drag">
                            <DragIndicatorIcon
                              style={{ width: "16px", height: "16px" }}
                            />
                          </span>
                          <span style={{ color: "#787774" }} className="icon">
                            {getColumnIcon({
                              column: {
                                type: field?.type ?? field?.relation_type,
                                table_slug: field?.table_slug ?? field?.slug,
                              },
                            })}
                          </span>
                        </Box>
                        <Box
                          fontSize="14px"
                          color="#787774"
                          fontWeight="500"
                          width="100%"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {getFieldLanguageLabel(field)}
                        </Box>
                      </Box>
                      <Box sx={{ width: "60%" }}>
                        <DrawerFieldGenerator
                          reset={reset}
                          activeLang={activeLang}
                          drawerDetail={true}
                          control={control}
                          field={field}
                          watch={watch}
                          isDisabled={field?.attributes?.disabled}
                          setFormValue={setFormValue}
                          errors={errors}
                        />
                      </Box>
                    </Box>
                  </Draggable>
                ))}
            </Container>
          </Box>
        ))}
      </Box>

      <Box
        onMouseDown={handleMouseDown}
        sx={{
          position: "absolute",
          height: "calc(100vh - 50px)",
          width: "3px",
          left: 0,
          top: 0,
          cursor: "col-resize",
        }}
      />
    </>
  );
}

const HeadingOptions = ({
  watch,
  control,
  fieldsMap,
  selectedTab,
  selectedRow,
  setFormValue = () => {},
}) => {
  const {i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const selectedFieldSlug =
    watch("attributes.layout_heading") ||
    selectedTab?.attributes?.layout_heading;

  const selectedField = Object.values(fieldsMap).find(
    (field) => field?.slug === selectedFieldSlug
  );

  const fieldValue = selectedField
    ? (selectedRow?.[selectedField.slug] ?? "")
    : "";

  const fieldsList = Object.values(fieldsMap).map((field) => ({
    label: field?.attributes?.[`label_${i18n?.language}`] ?? field?.label,
    value: field?.slug,
    type: field?.type,
    table_slug: field?.slug,
  }));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option) {
      setFormValue("attributes.layout_heading", option.table_slug);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        className="layoutHeading"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "3px",
          gap: "10px",
        }}>
        <Flex
          onClick={(e) =>
            !Boolean(watch("attributes.layout_heading")) && handleClick(e)
          }
          flexDirection={"column"}
          justifyContent={"flex-start"}>
          <CHTextField
            placeholder={
              Boolean(watch("attributes.layout_heading")) ||
              !Boolean(watch(selectedField?.slug))
                ? "Enter value"
                : "Select field"
            }
            control={control}
            name={selectedField?.slug || ""}
            defaultValue={fieldValue}
            key={selectedField?.slug}
          />
        </Flex>

        <Box sx={{cursor: "pointer"}}>
          <Flex
            p={"5px"}
            borderRadius={6}
            onClick={handleClick}
            gap={2}
            alignItems={"center"}>
            <Text>
              {
                fieldsList?.find(
                  (field) => field?.value === watch("attributes.layout_heading")
                )?.label
              }
            </Text>
            {anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Flex>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}>
        <Box sx={{width: "180px", padding: "4px 0"}}>
          {fieldsList
            .filter(
              (field) => field?.type === "SINGLE_LINE" || field?.type === "TEXT"
            )
            .map((option) => (
              <MenuItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: "6px",
                  color: "#37352f",
                  height: "32px",
                }}
                key={option.label}
                onClick={() => handleClose(option)}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}>
                  {option.label}
                </Box>

                <Box>
                  {option.table_slug === selectedFieldSlug ? <Check /> : ""}
                </Box>
              </MenuItem>
            ))}
        </Box>
      </Menu>
    </>
  );
};

const CHTextField = ({
  control,
  name = "",
  defaultValue = "",
  placeholder = "",
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <TextField
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="headingText"
          value={value ?? ""}
        />
      )}
    />
  );
};

export default DrawerFormDetailPage;
