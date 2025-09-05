import { Box, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import cls from "./styles.module.scss";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { TranslateIcon } from "../../../utils/constants/icons";
import clsx from "clsx";

export default function TextFieldWithMultiLanguage({
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
  // field,
  disabled_text = "This field is disabled for this role!",
  customOnChange = () => {},
  id,
  leftContent,
  watch = () => {},
  ...props
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages?.[0]?.slug
  );
  const [fieldName, setFieldName] = useState(name);
  const [fieldPlaceholder, setFieldPlaceholder] = useState(placeholder);

  // const watch = useWatch({
  //   control,
  // });

  const defaultValue = useMemo(
    () => watch(fieldName) ?? "",
    [watch, fieldName]
  );

  const handleClickLanguage = () => {
    const activeLanguageIndex = languages?.findIndex(
      (language) => language.slug === selectedLanguage
    );
    if (activeLanguageIndex === languages?.length - 1)
      setSelectedLanguage(languages[0]?.slug);
    else setSelectedLanguage(languages[activeLanguageIndex + 1]?.slug);
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
    <Box width={"100%"}>
      <Controller
        control={control}
        name={fieldName}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <InputGroup>
            <Input
              {...props}
              defaultValue={defaultValue}
              className={clsx(cls.input, {
                [cls.leftContent]: leftContent,
              })}
              onChange={(e) => {
                onChange(e);
                customOnChange(e, selectedLanguage);
              }}
              // value={value}
              placeholder={fieldPlaceholder}
              disabled={disabled}
              id={id}
            />
            {leftContent && (
              <InputLeftElement
                sx={{
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {leftContent}
              </InputLeftElement>
            )}
            <InputRightElement
              sx={{ right: "10px", top: "50%", transform: "translateY(-50%)" }}
            >
              <button
                className={cls.languageBtn}
                type="button"
                onClick={handleClickLanguage}
              >
                <span className={cls.languageBtnInner}>
                  <TranslateIcon />
                  <span>{selectedLanguage}</span>
                </span>
              </button>
            </InputRightElement>
          </InputGroup>
        )}
      />
      {/* <TextField
        key={fieldName}
        control={control}
        name={fieldName}
        fullWidth
        placeholder={fieldPlaceholder}
        defaultValue={defaultValue}
        id={id}
        {...props}
      />

      {languages?.length > 1 && (
        <Badge badgeContent={selectedLanguage} color="primary">
          <Button
            className={cls.btn}
            id="basic-button"
            variant="outlined"
            color="inherit"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <TranslateIcon width="16" height="16" />
          </Button>
        </Badge>
      )} */}

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
              background: selectedLanguage === language?.slug ? "#f0f0f0" : "",
            }}
          >
            {language?.title}
          </MenuItem>
        ))}
      </Menu> */}
    </Box>
  );
}
