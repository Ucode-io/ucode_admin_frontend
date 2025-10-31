import {Flex, Text} from "@chakra-ui/react";
import {Box, Button, Menu, MenuItem, TextField} from "@mui/material";
import React, {memo, useEffect, useMemo, useRef, useState} from "react";
import {Controller, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Check} from "@mui/icons-material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {FIELD_TYPES} from "@/utils/constants/fieldTypes";
import {useSelector} from "react-redux";
import useDebounce from "@/hooks/useDebounce";

const HeadingOptions = ({
  watch,
  control,
  fieldsMap,
  selectedTab,
  selectedRow,
  setFormValue = () => {},
  activeLang,
  isMultiLanguage,
  langs,
  updateObject = () => {},
  updateLayout = () => {},
}) => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const itemId = query.get("p");

  const removeLangFromSlug = (slug) => {
    if (typeof slug !== "string") return false;
    var lastIndex = slug?.lastIndexOf("_");
    if (lastIndex !== -1) {
      var result = slug?.substring(0, lastIndex);
      return result;
    } else {
      return false;
    }
  };

  let selectedFieldSlug = useMemo(() => {
    if (!watch("attributes.layout_heading")) {
      if (
        isMultiLanguage &&
        typeof selectedTab?.attributes?.layout_heading === "object"
      ) {
        return selectedTab?.attributes?.layout_heading?.[activeLang];
      } else {
        return selectedTab?.attributes?.layout_heading;
      }
    } else if (
      isMultiLanguage &&
      watch("attributes.layout_heading")?.[activeLang]
    ) {
      return watch("attributes.layout_heading")?.[activeLang];
    } else if (
      isMultiLanguage &&
      !removeLangFromSlug(watch("attributes.layout_heading"))
    ) {
      return watch("attributes.layout_heading");
    } else {
      return watch("attributes.layout_heading");
    }
  }, [
    watch("attributes.layout_heading"),
    activeLang,
    isMultiLanguage,
    selectedTab?.attributes?.layout_heading,
  ]);

  const selectedField = Object.values(fieldsMap).find(
    (field) => field?.slug === selectedFieldSlug
  );

  const fieldValue = selectedField
    ? (selectedRow?.[selectedField.slug] ?? "")
    : "";
  const fieldsList = Object.values(fieldsMap)
    .map((field) => ({
      label: field?.attributes?.[`label_${i18n?.language}`] ?? field?.label,
      value: field?.slug,
      type: field?.type,
      table_slug: field?.slug,
    }))
    .filter(
      (field) =>
        field?.type === FIELD_TYPES.SINGLE_LINE ||
        field?.type === FIELD_TYPES.TEXT ||
        field?.type === FIELD_TYPES.INCREMENT_ID
    );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option) {
      if (isMultiLanguage) {
        let layoutHeading = {};

        if (removeLangFromSlug(option?.value)) {
          langs?.forEach((lang) => {
            layoutHeading[lang?.short_name] = fieldsList?.find(
              (field) =>
                field?.value ===
                `${removeLangFromSlug(option?.value)}_${lang?.short_name}`
            )?.value;
          });
        } else {
          layoutHeading = option?.value;
        }

        setFormValue("attributes.layout_heading", layoutHeading);
      } else {
        setFormValue("attributes.layout_heading", option.value);
      }
    }
    updateLayout();
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        className="layoutHeading"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          paddingLeft: "3px",
          gap: "10px",
        }}
      >
        <Flex
          onClick={(e) => !selectedFieldSlug && handleClick(e)}
          // onClick={(e) => handleClick(e)}
          width={"100%"}
          flexDirection={"column"}
          justifyContent={"flex-start"}
        >
          <AutoResizeTextarea
            updateObject={updateObject}
            control={control}
            selectedField={selectedField}
            selectedFieldSlug={selectedFieldSlug}
            fieldValue={fieldValue}
            placeholder="Empty"
            watch={watch}
            setValue={setFormValue}
          />
        </Flex>

        <Box sx={{ display: "flex", gap: "10px" }}>
          {!selectedFieldSlug && (
            <Box sx={{ cursor: "pointer" }}>
              <Flex
                p={"5px"}
                borderRadius={6}
                onClick={handleClick}
                gap={2}
                alignItems={"center"}
              >
                <Text>
                  {
                    fieldsList?.find(
                      (field) =>
                        field?.value === watch("attributes.layout_heading")
                    )?.label
                  }
                </Text>
                {anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Flex>
            </Box>
          )}
          {Boolean(!itemId) && (
            <Button variant="contained" type="submit">
              Save
            </Button>
          )}
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}
      >
        <Box sx={{ width: "180px", padding: "4px 0" }}>
          {fieldsList?.map((option) => (
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
              onClick={() => handleClose(option)}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
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

const AutoResizeTextarea = ({
  control,
  selectedField,
  selectedFieldSlug,
  fieldValue,
  watch,
  setValue,
  updateObject = () => {},
  ...props
}) => {
  const textareaRef = useRef(null);
  const name = typeof selectedFieldSlug === "string" ? selectedFieldSlug : "";

  const headingValue = name ? watch(name) : "";

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [headingValue]);

  const inputChangeHandler = useDebounce(() => updateObject(), 500);

  return name ? (
    <Controller
      control={control}
      name={name ?? ""}
      defaultValue={fieldValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <textarea
            ref={textareaRef}
            value={headingValue}
            onChange={(e) => {
              onChange(e.target.value);
              inputChangeHandler();
            }}
            rows={1}
            style={{
              resize: "none",
              outline: "none",
              maxWidth: "100%",
              width: "100%",
              whiteSpace: "break-spaces",
              wordBreak: "breakWord",
              caretColor: "rgb(50, 48, 44)",
              padding: "0px 2px 0px",
              fontSize: "32px",
              fontWeight: "900",
              lineHeight: "1.3",
              margin: "0px",
              overflow: "hidden",
            }}
            {...props}
          />
        );
      }}
    />
  ) : (
    <></>
  );
};

export default HeadingOptions;
