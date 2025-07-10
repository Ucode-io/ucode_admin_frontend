import {Flex, Text} from "@chakra-ui/react";
import {Box, Button, Menu, MenuItem, TextField} from "@mui/material";
import React, {useState} from "react";
import {Controller} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Check} from "@mui/icons-material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {FIELD_TYPES} from "../../../utils/constants/fieldTypes";

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
              Boolean(watch("attributes.layout_heading")) ? "" : "Select field"
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
        <Button variant="contained" type="submit">
          Save
        </Button>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}>
        <Box sx={{width: "180px", padding: "4px 0"}}>
          {fieldsList
            .filter(
              (field) =>
                field?.type === FIELD_TYPES.SINGLE_LINE ||
                field?.type === FIELD_TYPES.TEXT ||
                field?.type === FIELD_TYPES.INCREMENT_ID
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

export default HeadingOptions;
