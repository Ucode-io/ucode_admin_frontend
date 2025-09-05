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
        key={fieldName}
        control={control}
        name={fieldName}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
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
              placeholder={fieldPlaceholder}
              disabled={disabled}
              id={id}
              value={value}
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
    </Box>
  );
}
