import {Box, Menu, MenuItem, TextField, Button} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Container, Draggable} from "react-smooth-dnd";
import "./style.scss";
import {useParams} from "react-router-dom";
import {Check} from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {Controller} from "react-hook-form";
import layoutService from "../../services/layoutService";
import {applyDrag} from "../../utils/applyDrag";
import {getColumnIcon} from "../../views/table-redesign/icons";
import DrawerFieldGenerator from "../../views/Objects/DrawerDetailPage/ElementGenerator/DrawerFieldGenerator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {Flex, Text} from "@chakra-ui/react";
import {store} from "../../store";

function NewModalFormPage({
  control,
  watch,
  data,
  layout,
  fieldsMap,
  selectedRow,
  projectInfo,
  selectedTab = {},
  selectedTabIndex = 0,
  setFormValue = () => {},
}) {
  const {i18n} = useTranslation();
  const {tableSlug} = useParams();
  const [dragAction, setDragAction] = useState(false);
  const [activeLang, setActiveLang] = useState();
  const auth = store.getState().auth;

  const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
  const [sections, setSections] = useState(data?.tabs?.[0]?.sections || []);

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

  const updateCurrentLayout = async (newSections) => {
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

    await layoutService.update(currentUpdatedLayout, tableSlug);
  };

  useEffect(() => {
    setFormValue(
      "attributes.layout_heading",
      selectedTab?.attributes?.layout_heading
    );
  }, [selectedTab, selectedRow]);

  const getFieldLanguageLabel = (el) => {
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
    return !!allFields.find((field) => field?.enable_multilanguage === true);
  }, [selectedTab]);

  useEffect(() => {
    if (isMultiLanguage) {
      setActiveLang(projectInfo?.language?.[0]?.short_name);
    }
  }, [isMultiLanguage, projectInfo]);

  return (
    <>
      <Box id="newModalDetail" mt="10px" pb={"10px"}>
        {isMultiLanguage && (
          <div className={"language"}>
            {projectInfo?.language?.map((lang) => (
              <Button
                className={activeLang === lang?.short_name && "active"}
                onClick={() => setActiveLang(lang?.short_name)}>
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

        {sections?.length &&
          sections?.map((section, secIndex) => (
            <Container
              key={section?.id}
              behaviour="contain"
              onDragStart={() => setDragAction(true)}
              onDragEnd={() => setDragAction(false)}
              dragHandleSelector=".drag-handles"
              dragClass="drag-item"
              onDrop={(dropResult) => onDrop(secIndex, dropResult)}>
              {section?.fields?.length &&
                section?.fields.map((field, fieldIndex) => {
                  const isHidden =
                    field?.slug === watch("attributes.layout_heading");
                  return (
                    <Draggable
                      key={fieldIndex}
                      className={Boolean(defaultAdmin) ? `drag-handles` : ""}>
                      <Box
                        className={dragAction ? "rowDragCol" : "rowCol"}
                        display={isHidden ? "none" : "flex"}
                        alignItems="center"
                        height={"34px"}
                        py="8px">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent={"space-between"}
                          padding="5px"
                          borderRadius={"4px"}
                          width="200px"
                          sx={{
                            "&:hover": {
                              backgroundColor: "#F7F7F7",
                            },
                          }}>
                          <Box
                            width="18px"
                            height="16px"
                            mr="8px"
                            display="flex"
                            alignItems="center"
                            sx={{color: "#787774"}}>
                            <span className={"drag"}>
                              <DragIndicatorIcon
                                style={{width: "16px", height: "16px"}}
                              />
                            </span>
                            <span style={{color: "#787774"}} className={"icon"}>
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
                            width="100%">
                            {getFieldLanguageLabel(field)}
                          </Box>
                        </Box>
                        <Box sx={{minWidth: "500px"}}>
                          <DrawerFieldGenerator
                            activeLang={activeLang}
                            drawerDetail={true}
                            control={control}
                            field={field}
                            watch={watch}
                          />
                        </Box>
                      </Box>
                    </Draggable>
                  );
                })}
            </Container>
          ))}
      </Box>
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
        className={"layoutHeading"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "3px",
          gap: "10px",
        }}>
        <Box
          onClick={(e) =>
            !Boolean(watch("attributes.layout_heading")) && handleClick(e)
          }>
          <CHTextField
            placeholder={
              Boolean(watch("attributes.layout_heading")) ? "" : "Select field"
            }
            control={control}
            name={selectedField?.slug || ""}
            defaultValue={fieldValue}
            key={selectedField?.slug}
          />
        </Box>

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
                  {/* <span>
                    {getColumnIcon({
                      column: {
                        type: option?.type ?? option?.relation_type,
                        table_slug: "field",
                      },
                    })}
                  </span> */}
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

export default NewModalFormPage;
