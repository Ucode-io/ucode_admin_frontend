import {Box, Button, Menu, MenuItem, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Container, Draggable} from "react-smooth-dnd";
import {getColumnIcon} from "../../table-redesign/icons";
import DrawerFieldGenerator from "./ElementGenerator/DrawerFieldGenerator";

import "./style.scss";
import layoutService from "../../../services/layoutService";
import {useParams} from "react-router-dom";
import {Check} from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {Controller} from "react-hook-form";
import {Flex} from "@chakra-ui/react";
import {applyDrag} from "../../../utils/applyDrag";

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
  setFormValue = () => {},
}) {
  const {i18n} = useTranslation();
  const {tableSlug} = useParams();
  const [dragAction, setDragAction] = useState(false);

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
    setFormValue(
      "attributes.layout_heading",
      selectedTab?.attributes?.layout_heading
    );
  }, [selectedTab, selectedRow]);

  useEffect(() => {
    if (!data?.tabs?.[0]?.sections) return;

    const updatedSections = data.tabs[0].sections.map((section) => ({
      ...section,
      fields: section.fields.filter(
        (el) => el?.slug !== watch("attributes.layout_heading")
      ),
    }));

    setSections(updatedSections);
  }, [data, watch("attributes.layout_heading")]);

  return (
    <>
      <Box
        mt="10px"
        sx={{height: "calc(100vh - 44px)"}}
        pb={"10px"}
        overflow={"auto"}>
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
              overflow: "hidden",
            }}
            key={secIndex}>
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
              onDrop={(dropResult) => onDrop(secIndex, dropResult)}>
              {section?.fields.map((field, fieldIndex) => (
                <Draggable
                  className="drag-handle"
                  key={field?.id ?? fieldIndex}>
                  <Box
                    className={dragAction ? "rowColumnDrag" : "rowColumn"}
                    display="flex"
                    alignItems="center"
                    {...(Boolean(field?.type === "MULTISELECT")
                      ? {minHeight: "30px"}
                      : {height: "34px"})}
                    py="8px">
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
                      }}>
                      <Box
                        width="18px"
                        height="16px"
                        mr="8px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{color: "#787774"}}>
                        <span className="drag">
                          <DragIndicatorIcon
                            style={{width: "16px", height: "16px"}}
                          />
                        </span>
                        <span style={{color: "#787774"}} className="icon">
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
                        {field?.attributes?.[`label_${i18n?.language}`] ||
                          field?.label}
                      </Box>
                    </Box>
                    <Box sx={{width: "60%"}}>
                      <DrawerFieldGenerator
                        control={control}
                        field={field}
                        watch={watch}
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
          onClick={handleClick}
          flexDirection={"column"}
          justifyContent={"flex-start"}>
          <CHTextField
            control={control}
            name={selectedField?.slug || ""}
            defaultValue={fieldValue}
            key={selectedField?.slug}
          />
        </Flex>

        <Box className="fieldChoose" sx={{cursor: "pointer"}}>
          <img
            src="/img/text-column.svg"
            width={"22px"}
            height={"22px"}
            alt="heading text"
          />
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}>
        <Box sx={{width: "220px", padding: "4px 0"}}>
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
                }}
                key={option.label}
                onClick={() => handleClose(option)}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}>
                  <span>
                    {getColumnIcon({
                      column: {
                        type: option?.type ?? option?.relation_type,
                        table_slug: "field",
                      },
                    })}
                  </span>
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

const CHTextField = ({control, name = "", defaultValue = ""}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <TextField
          onChange={(e) => onChange(e.target.value)}
          className="headingText"
          value={value ?? ""}
        />
      )}
    />
  );
};

export default DrawerFormDetailPage;
