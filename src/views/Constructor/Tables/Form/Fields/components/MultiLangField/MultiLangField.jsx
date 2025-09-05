import cls from "./styles.module.scss"
import TranslateIcon from "@mui/icons-material/Translate";
import {Badge, Box, Button, Menu, MenuItem} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import HFTextField from "../../../../../../../components/FormElements/HFTextField";
import { useWatch } from "react-hook-form";
import { fieldTypeIcons } from "@/utils/constants/icons";

export const MultiLangField = ({
  control,
  name = "",
  isFormEdit = false,
  isBlackBg,
  updateObject,
  isNewTableView = false,
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  disabled,
  tabIndex,
  checkRequiredField,
  placeholder = "",
  languages,
  endAdornment,
  field,
  disabled_text = "This field is disabled for this role!",
  customOnChange = () => {},
  id,
  watch = () => {},
  ...props
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages?.[0]?.slug
  );
  const [fieldName, setFieldName] = useState(name);
  const [fieldPlaceholder, setFieldPlaceholder] = useState(placeholder);
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);

  const formWatch = useWatch({
    control,
  });

  const defaultValue = useMemo(
    () => formWatch[fieldName] ?? "",
    [formWatch, fieldName]
  );

  const handleClick = (event) => {
    // setAnchorEl(event.currentTarget);
    if (
      languages?.length - 1 >
      languages.findIndex((lang) => lang.slug === selectedLanguage)
    ) {
      setSelectedLanguage(
        languages[
          languages.findIndex((lang) => lang.slug === selectedLanguage) + 1
        ]?.slug
      );
    } else {
      setSelectedLanguage(languages[0]?.slug);
    }
  };
  // const handleClose = (language) => {
  //   setSelectedLanguage(language);
  //   setAnchorEl(null);
  // };

  useEffect(() => {
    setFieldName(`${name}_${selectedLanguage}`);
    setFieldPlaceholder(`${placeholder} (${selectedLanguage})`);
  }, [selectedLanguage, name, placeholder]);

  useEffect(() => {
    if (languages?.length) {
      setSelectedLanguage(languages[0]?.slug);
    }
  }, [languages]);

  return (
    <>
      <HFTextField
        className={cls.field}
        inputStyles={{
          padding: "6px 14px 6px 6px",
          fontSize: "12px",
          lineHeight: "18px",
        }}
        key={fieldName}
        control={control}
        name={fieldName}
        fullWidth
        placeholder={fieldPlaceholder}
        defaultValue={defaultValue}
        id={id}
        required={required}
        startAdornment={
          <Box className={cls.iconBox}>{fieldTypeIcons[watch("type")]}</Box>
        }
        endAdornment={
          <Box paddingLeft="8px" marginY="5px" borderLeft="1px solid #EAECF0">
            <button className={cls.languageBtn} onClick={handleClick}>
              <span className={cls.languageBtnInner}>
                <TranslateIcon />
                <span>{selectedLanguage}</span>
              </span>
            </button>
            {/* <button className={cls.langButton} onClick={handleClick}>
              <span className={cls.langButtonInner}>
                {languages?.length > 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="transparent"
                    viewBox="0 0 20 20"
                  >
                    <g clip-path="url(#a)">
                      <path
                        stroke="#8F8E8B"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M10 1.667A12.75 12.75 0 0 1 13.334 10 12.75 12.75 0 0 1 10 18.334m0-16.667A12.75 12.75 0 0 0 6.667 10 12.75 12.75 0 0 0 10 18.334m0-16.667a8.333 8.333 0 0 0 0 16.667m0-16.667a8.333 8.333 0 1 1 0 16.667M2.084 7.5h15.833m-15.833 5h15.833"
                      />
                    </g>
                    <defs>
                      <clipPath id="a">
                        <path fill="#fff" d="M0 0h20v20H0z" />
                      </clipPath>
                    </defs>
                  </svg>
                )}
                <span>{selectedLanguage}</span>
              </span>
            </button> */}
            {/* <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => {
                handleClose(selectedLanguage);
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {languages?.map((language) => (
                <MenuItem
                  onClick={() => {
                    handleClose(language?.slug);
                  }}
                  style={{
                    background:
                      selectedLanguage === language?.slug ? "#f0f0f0" : "",
                  }}
                >
                  {language?.title}
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
        }
      />

      {/* {languages?.length > 1 && (
          <Button
            id="basic-button"
            variant="outlined"
            color="inherit"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}>
              {selectedLanguage}
          </Button>
      )}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          handleClose(selectedLanguage);
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        {languages?.map((language) => (
          <MenuItem
            onClick={() => {
              handleClose(language?.slug);
            }}
            style={{
              background: selectedLanguage === language?.slug ? "#f0f0f0" : "",
            }}>
            {language?.title}
          </MenuItem>
        ))}
      </Menu> */}
    </>
  );
};
