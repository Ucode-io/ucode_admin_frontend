import cls from "./styles.module.scss"
import TranslateIcon from "@mui/icons-material/Translate";
import {Badge, Box, Button, Menu, MenuItem} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import HFTextField from "../../../../../../../components/FormElements/HFTextField";
import { useWatch } from "react-hook-form";

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
  ...props
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages?.[0]?.slug
  );
  const [fieldName, setFieldName] = useState(name);
  const [fieldPlaceholder, setFieldPlaceholder] = useState(placeholder);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const watch = useWatch({
    control,
  });

  const defaultValue = useMemo(
    () => watch[fieldName] ?? "",
    [watch, fieldName]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (language) => {
    setSelectedLanguage(language);
    setAnchorEl(null);
  };

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
        key={fieldName}
        control={control}
        name={fieldName}
        fullWidth
        placeholder={fieldPlaceholder}
        defaultValue={defaultValue}
        id={id}
        endAdornment={
          <Box paddingLeft="8px" marginY="5px" borderLeft="1px solid #EAECF0">
            <button className={cls.langButton} onClick={handleClick}>
              <span className={cls.langButtonInner}>
                <span>{selectedLanguage}</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="#D0D5DD" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>
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
            </Menu>
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
}
