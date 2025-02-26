import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Container, Draggable} from "react-smooth-dnd";
import {getColumnIcon} from "../../table-redesign/icons";
import DrawerFieldGenerator from "./ElementGenerator/DrawerFieldGenerator";
import {applyDrag} from "../../../utils/applyDrag";
import "./style.scss";
import layoutService from "../../../services/layoutService";
import {useParams} from "react-router-dom";
import {Check} from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {Controller} from "react-hook-form";

function DrawerFormDetailPage({
  control,
  watch,
  data,
  layout,
  fieldsMap,
  selectedTab = {},
  selectedTabIndex = 0,
  setFormValue = () => {},
}) {
  const {i18n} = useTranslation();
  const {tableSlug} = useParams();

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
  }, [selectedTab]);

  return (
    <>
      <Box
        mt="10px"
        sx={{height: "calc(100vh - 44px)"}}
        pb={"10px"}
        overflow={"auto"}>
        <HeadingOptions
          watch={watch}
          control={control}
          fieldsMap={fieldsMap}
          selectedTab={selectedTab}
          setFormValue={setFormValue}
        />

        {sections?.map((section, secIndex) => (
          <Box sx={{margin: "12px 0 0 0"}} key={secIndex}>
            <Container
              style={{width: "100%"}}
              dragHandleSelector=".drag-handle"
              lockAxis="y"
              onDrop={(dropResult) => onDrop(secIndex, dropResult)}>
              {section?.fields?.map((field, fieldIndex) => (
                <Draggable className="drag-handle" key={field?.id}>
                  <Box
                    className="rowColumn"
                    key={fieldIndex}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
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
                      width="40%"
                      sx={{
                        "&:hover": {
                          backgroundColor: "#F7F7F7",
                        },
                      }}>
                      <Box
                        width="14px"
                        height="16px"
                        mr="8px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center">
                        <span className="drag">
                          <DragIndicatorIcon
                            style={{width: "16px", height: "16px"}}
                          />
                        </span>
                        <span className="icon">
                          {getColumnIcon({
                            column: {
                              type: field?.type ?? field?.relation_type,
                              table_slug: field?.table_slug ?? field?.slug,
                            },
                          })}
                        </span>
                      </Box>
                      <Box
                        fontSize="12px"
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
    </>
  );
}

const HeadingOptions = ({
  watch,
  control,
  fieldsMap,
  selectedTab,
  setFormValue = () => {},
}) => {
  const {i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const fieldsList = Object.values(fieldsMap).map((field) => ({
    label: field?.attributes?.[`label_${i18n?.language}`] ?? field?.label,
    value: field?.attributes?.[`label_${i18n?.language}`] ?? field?.label,
    type: field?.type,
    table_slug: field?.table_slug || field?.slug,
  }));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    setFormValue("attributes.layout_heading", option?.label);
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "3px",
          gap: "10px",
        }}>
        {!Boolean(watch("attributes.layout_heading")) && (
          <span style={{cursor: "pointer"}} onClick={handleClick}>
            <img
              src="/img/text-column.svg"
              width={"22px"}
              height={"22px"}
              alt="heading text"
            />
          </span>
        )}
        <CHTextField
          defaultValue={selectedTab?.attributes?.layout_heading}
          control={control}
          name={"attributes.layout_heading"}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}>
        <Box sx={{width: "220px", padding: "4px 0"}}>
          {fieldsList
            ?.filter(
              (field) => field?.type === "SINGLE_LINE" || field?.type === "TEXT"
            )
            ?.map((option) => (
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
                <Box sx={{display: "flex", alignItems: "center", gap: "5px"}}>
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
                  {option.label === selectedTab?.attributes?.layout_heading ? (
                    <Check />
                  ) : (
                    ""
                  )}
                </Box>
              </MenuItem>
            ))}
        </Box>
      </Menu>
    </>
  );
};

const CHTextField = ({control, name, defaultValue = ""}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <TextField
            onChange={(e) => onChange(e.target.value)}
            className="headingText"
            value={value}
          />
        );
      }}
    />
  );
};

export default DrawerFormDetailPage;
