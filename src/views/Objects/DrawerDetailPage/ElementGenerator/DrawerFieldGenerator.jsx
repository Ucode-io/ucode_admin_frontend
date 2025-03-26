import React, {useEffect, useState} from "react";
import RelationField from "./RelationField";
import {
  HFDateDatePickerWithoutTimeZoneTableField,
  HFDatePickerField,
  HFDateTimePickerField,
  HFTimePickerField,
} from "./hf-datePickers";
import HFPhotoUpload from "../../../../components/FormElements/HFPhotoUpload";
import HFMultipleAutocomplete from "./hf-multiselectField";
import HFStatusField from "./hf-statusField";
import HFCheckbox from "./hf-checkboxField";
import {HFVideoUpload} from "./hf-videoUploadField";
import HFSwitch from "../../../table-redesign/hf-switch";
import HFMultiImage from "../../../../components/FormElements/HFMultiImage";
import HFLinkField from "../../../../components/FormElements/HFLinkField";
import HFFileUpload from "../../../../components/FormElements/HFFileUpload";
import HFMoneyField from "./hf-moneyField";
import {Controller, useWatch} from "react-hook-form";
import {ChakraProvider, Input, InputGroup} from "@chakra-ui/react";
import {NumericFormat} from "react-number-format";
import {
  Box,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Tooltip,
} from "@mui/material";
import HFTextEditor from "../../../../components/FormElements/HFTextEditor";
import HFModalMap from "../../../../components/FormElements/HFModalMap";
import PolygonFieldTable from "../../../../components/ElementGenerators/PolygonFieldTable";
import HFIconPicker from "./hf-iconPicker";
import HFColorPicker from "./hf-colorPicker";
import {Parser} from "hot-formula-parser";
import useDebouncedWatch from "../../../../hooks/useDebouncedWatch";
import FunctionsIcon from "@mui/icons-material/Functions";
import {Lock} from "@mui/icons-material";
import HFMultiFile from "../../../../components/FormElements/HFMultiFile";
import {numberWithSpaces} from "../../../../utils/formatNumbers";

function DrawerFieldGenerator({
  field,
  control,
  watch,
  drawerDetail,
  isDisabled,
}) {
  switch (field?.relation_type ?? field?.type) {
    case "Many2One":
      return (
        <RelationField
          disabled={isDisabled}
          field={field}
          control={control}
          name={field?.slug}
        />
      );
    case "MULTI_LINE":
      return (
        <MultiLineInput
          isDisabled={isDisabled}
          placeholder={"Empty"}
          control={control}
          name={field?.slug}
          field={field}
          watch={watch}
        />
      );
    case "DATE":
      return (
        <HFDatePickerField
          disabled={isDisabled}
          field={field}
          control={control}
          name={field?.slug}
          drawerDetail={drawerDetail}
        />
      );

    case "DATE_TIME":
      return (
        <HFDateTimePickerField
          disabled={isDisabled}
          field={field}
          control={control}
          name={field?.slug}
          drawerDetail={drawerDetail}
        />
      );
    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return (
        <HFDateDatePickerWithoutTimeZoneTableField
          disabled={isDisabled}
          field={field}
          control={control}
          name={field?.slug}
          drawerDetail={true}
        />
      );
    case "TIME":
      return (
        <HFTimePickerField
          disabled={isDisabled}
          control={control}
          name={field?.slug}
          field={field}
          drawerDetail={drawerDetail}
        />
      );

    case "PASSWORD":
      return (
        <InputField
          disabled={isDisabled}
          type="password"
          control={control}
          name={field?.slug}
        />
      );

    case "SWITCH":
      return (
        <HFSwitch
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
        />
      );

    case "VIDEO":
      return (
        <HFVideoUpload
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
        />
      );

    case "CHECKBOX":
      return (
        <HFCheckbox
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
        />
      );

    case "STATUS":
      return (
        <HFStatusField
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
          field={field}
        />
      );

    case "MULTISELECT":
      return (
        <HFMultipleAutocomplete
          disabled={isDisabled}
          control={control}
          name={field?.slug}
          field={field}
          placeholder={"Empty"}
        />
      );

    case "PHOTO":
      return (
        <HFPhotoUpload
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
          field={field}
        />
      );

    case "MULTI_IMAGE":
      return (
        <HFMultiImage
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          isTableView={true}
          control={control}
          name={field?.slug}
          field={field}
        />
      );

    case "MULTI_FILE":
      return (
        <HFMultiFile
          disabled={isDisabled}
          drawerDetail={true}
          isTableView={true}
          control={control}
          name={field?.slug}
          field={field}
        />
      );

    case "LINK":
      return (
        <HFLinkField
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
          field={field}
          placeholder={"Empty"}
        />
      );

    case "NUMBER":
    case "FLOAT":
      return (
        <NumberField
          disabled={isDisabled}
          control={control}
          name={field?.slug}
          field={field}
          placeholder="Empty"
        />
      );

    case "FILE":
      return (
        <HFFileUpload
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
          field={field}
        />
      );

    case "MONEY":
      return (
        <HFMoneyField
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
          field={field}
          watch={watch}
        />
      );
    case "MAP":
      return (
        <HFModalMap
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
          field={field}
          placeholder="Empty"
        />
      );
    case "POLYGON":
      return (
        <PolygonFieldTable
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          computedSlug={field?.slug}
          field={field}
        />
      );

    case "ICON":
      return (
        <HFIconPicker
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
          field={field}
        />
      );
    case "COLOR":
      return (
        <HFColorPicker
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={field?.slug}
          field={field}
        />
      );

    case "FORMULA_FRONTEND":
      return (
        <FormulaField
          disabled={isDisabled}
          control={control}
          name={field?.slug}
          field={field}
        />
      );

    default:
      return (
        <InputField
          disabled={isDisabled}
          control={control}
          name={field?.slug}
        />
      );
  }
}

const InputField = ({control, name = "", type = "text", disabled = false}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value}}) => {
        return (
          <ChakraProvider>
            <Input
              disabled={disabled}
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Empty"
              height="30px"
              fontSize="13px"
              px={"9.6px"}
              width="100%"
              border="none"
              borderRadius={"4px"}
              _hover={{
                bg: "#F7F7F7",
              }}
              _focus={{
                backgroundColor: "#F7F7F7",
                border: "none",
                outline: "none",
              }}
            />
          </ChakraProvider>
        );
      }}
    />
  );
};

const NumberField = ({
  control,
  name,
  field,
  disabled = false,
  placeholder = "",
}) => {
  const handleChange = (event, onChange = () => {}) => {
    const inputValue = event.target.value.replace(/\s+/g, "");
    const parsedValue = inputValue ? parseFloat(inputValue) : "";

    if (parsedValue || parsedValue === 0) {
      onChange(parsedValue);
    } else {
      onChange("");
    }
  };
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}}) => {
          return (
            <NumericFormat
              maxLength={19}
              placeholder={placeholder}
              format="#### #### #### ####"
              mask="_"
              thousandsGroupStyle="thousand"
              thousandSeparator=" "
              decimalSeparator="."
              displayType="input"
              isNumericString={true}
              autoComplete="off"
              id={"numberField"}
              allowNegative
              style={{
                width: "100%",
                padding: "0 9.6px",
                outline: "none",
                color: "#212b36",
                fontSize: "13px",
              }}
              value={typeof value === "number" ? value : ""}
              onChange={(e) => handleChange(e, onChange)}
              className={"custom_textfield"}
              name={name}
              readOnly={disabled}
            />
          );
        }}
      />
    </>
  );
};

const MultiLineInput = ({
  control,
  name,
  isDisabled = false,
  field,
  isWrapField = false,
  watch,
  props,
  placeholder = "",
}) => {
  const value = useWatch({
    control,
    name: name,
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const stripHtmlTags = (input) => {
    return input.replace(/<[^>]*>/g, "");
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "325px",
          color: "#787774",
          padding: "5px 9.6px",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "#F7F7F7",
          },
        }}>
        <Box
          sx={{width: "100%", fontSize: "14px"}}
          id="textAreaInput"
          onClick={(e) => {
            !isDisabled && handleClick(e);
          }}>
          {stripHtmlTags(
            value
              ? `${value?.slice(0, 200)}${value?.length > 200 ? "..." : ""}`
              : "Empty"
          )}
        </Box>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}>
          <HFTextEditor
            drawerDetail={true}
            id="multi_line"
            control={control}
            name={name}
            tabIndex={field?.tabIndex}
            fullWidth
            multiline
            rows={4}
            defaultValue={field.defaultValue}
            disabled={isDisabled}
            key={name}
            isTransparent={true}
            {...props}
          />
        </Popover>
      </Box>
    </>
  );
};

const FormulaField = ({
  control,
  name,
  isTableView = false,
  tabIndex,
  rules = {},
  setFormValue = () => {},
  required,
  disabledHelperText,
  fieldsList,
  isNewTableView = false,
  disabled,
  defaultValue,
  field,
  ...props
}) => {
  const parser = new Parser();
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);
  const formula = field?.attributes?.formula ?? "";
  const values = useWatch({
    control,
  });

  const updateValue = () => {
    let computedFormula = formula;
    const fieldsListSorted = fieldsList
      ? [...fieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length)
      : [];
    fieldsListSorted?.forEach((field) => {
      let value = values[field.slug] ?? 0;

      if (typeof value === "string") value = `'${value}'`;
      if (typeof value === "object") value = `"${value}"`;
      if (typeof value === "boolean")
        value = JSON.stringify(value).toUpperCase();
      computedFormula = computedFormula.replaceAll(`${field.slug}`, value);
    });

    const {error, result} = parser.parse(computedFormula);

    let newValue = error ?? result;
    const prevValue = values[name];
    if (newValue !== prevValue) setFormValue(name, newValue);
  };

  useDebouncedWatch(updateValue, [values], 300);

  useEffect(() => {
    updateValue();
  }, []);
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <TextField
          className="formulaField"
          placeholder="Empty"
          size="small"
          value={
            formulaIsVisible
              ? formula
              : typeof value === "number"
                ? numberWithSpaces(parseFloat(value).toFixed(2))
                : value
          }
          name={name}
          onChange={(e) => {
            const val = e.target.value;
            const valueWithoutSpaces = val.replaceAll(" ", "");

            if (!valueWithoutSpaces) onChange("");
            else
              onChange(
                !isNaN(Number(valueWithoutSpaces))
                  ? Number(valueWithoutSpaces)
                  : ""
              );
          }}
          error={error}
          fullWidth
          disabled={disabled}
          autoFocus={tabIndex === 1}
          helperText={!disabledHelperText && error?.message}
          InputProps={{
            inputProps: {tabIndex},
            readOnly: disabled,

            endAdornment: (
              <InputAdornment position="end">
                <Box
                  style={{display: "flex", alignItems: "center", gap: "10px"}}>
                  <Tooltip
                    title={formulaIsVisible ? "Hide formula" : "Show formula"}>
                    <IconButton
                      edge="end"
                      color={formulaIsVisible ? "primary" : "default"}
                      onClick={() => setFormulaIsVisible((prev) => !prev)}>
                      <FunctionsIcon />
                    </IconButton>
                  </Tooltip>
                  {disabled && (
                    <Tooltip title="This field is disabled for this role!">
                      <InputAdornment position="start">
                        <Lock style={{fontSize: "20px"}} />
                      </InputAdornment>
                    </Tooltip>
                  )}
                </Box>
              </InputAdornment>
            ),
          }}
          {...props}
        />
      )}></Controller>
  );
};

export default DrawerFieldGenerator;
