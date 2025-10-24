import {
  Box as ChakraBox,
  ChakraProvider,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import {Lock} from "@mui/icons-material";
import FunctionsIcon from "@mui/icons-material/Functions";
import {
  Box,
  IconButton,
  InputAdornment,
  Popover,
  Skeleton,
  TextField,
  Tooltip,
} from "@mui/material";
import {Parser} from "hot-formula-parser";
import React, {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {Controller, useWatch} from "react-hook-form";
import {NumericFormat} from "react-number-format";
import {useQuery} from "react-query";
import PolygonFieldTable from "../../../../components/ElementGenerators/PolygonFieldTable";
import HFCodeField from "../../../../components/FormElements/HFCodeField";
import HFFileUpload from "../../../../components/FormElements/HFFileUpload";
import HFLinkField from "../../../../components/FormElements/HFLinkField";
import HFModalMap from "../../../../components/FormElements/HFModalMap";
import HFMultiFile from "../../../../components/FormElements/HFMultiFile";
import HFMultiImage from "../../../../components/FormElements/HFMultiImage";
import HFPhotoUpload from "../../../../components/FormElements/HFPhotoUpload";
import useDebouncedWatch from "../../../../hooks/useDebouncedWatch";
import constructorFunctionService from "../../../../services/constructorFunctionService";
import {numberWithSpaces} from "../../../../utils/formatNumbers";
import listToOptions from "../../../../utils/listToOptions";
import HFSwitch from "../../../table-redesign/hf-switch";
import MultiLineInput from "./MultiLineInput";
import HFCheckbox from "./hf-checkboxField";
import HFColorPicker from "./hf-colorPicker";
import {
  HFDateDatePickerWithoutTimeZoneTableField,
  HFDatePickerField,
  HFDateTimePickerField,
  HFTimePickerField,
} from "./hf-datePickers";
import HFIconPicker from "./hf-iconPicker";
import HFInternationalPhone from "./hf-internationalPhone";
import HFMultipleAutocomplete from "./hf-multiselectField";
import HFStatusField from "./hf-statusField";
import {HFVideoUpload} from "./hf-videoUploadField";
import {FIELD_TYPES} from "../../../../utils/constants/fieldTypes";
import cls from "./field-generator.styles.module.scss";
import useDebounce from "../../../../hooks/useDebounce";
// import RelationField from "./RelationField";

const RelationField = lazy(() => import("./RelationField"));

function DrawerFieldGenerator({
  field,
  control,
  watch = () => {},
  drawerDetail,
  isDisabled,
  activeLang = "",
  inviteModal = false,
  setFormValue = () => {},
  updateObject = () => {},
  errors,
  isRequired,
}) {
  const removeLangFromSlug = (slug) => {
    var lastIndex = slug.lastIndexOf("_");
    if (lastIndex !== -1) {
      var result = slug.substring(0, lastIndex);
      return result;
    } else {
      return false;
    }
  };

  const computedSlug = useMemo(() => {
    if (field?.enable_multilanguage) {
      return `${removeLangFromSlug(field.slug)}_${activeLang}`;
    } else if (field.id?.includes("@")) {
      return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
    } else if (field?.id?.includes("#")) {
      if (field?.type === "Many2Many") {
        return `${field.id?.split("#")?.[0]}_ids`;
      } else if (field?.type === "Many2One") {
        return `${field.id?.split("#")?.[0]}_id`;
      }
    }

    return field?.slug;
  }, [field?.slug, activeLang, field]);

  const placeholderField = useMemo(() => {
    if (inviteModal) {
      return field?.label ?? field?.attributes?.label;
    } else {
      return field?.placeholder ?? field?.attributes?.placeholder ?? "Empty";
    }
  }, [field, inviteModal]);

  // const defaultValue = useMemo(() => {
  //   if (
  //     field?.type === "DATE" ||
  //     field?.type === "DATE_TIME" ||
  //     field?.type === "DATE_TIME_WITHOUT_TIME_ZONE"
  //   ) {
  //     return field?.attributes?.defaultValue === "now()" ? new Date() : null;
  //   }
  // }, [field.type, field.id, field.relation_type]);

  const { data: functions = [] } = useQuery(
    ["GET_FUNCTIONS_LIST"],
    () => {
      return constructorFunctionService.getListV2({});
    },
    {
      onError: (err) => {
        console.log("ERR =>", err);
      },
      select: (res) => {
        return listToOptions(res.functions, "name", "id");
      },
    }
  );

  switch (field?.relation_type ?? field?.type) {
    case "Many2One":
    case "Many2Many":
    case "PERSON": {
      return (
        <Suspense
          fallback={
            <>
              <Skeleton
                sx={{
                  height: "23px",
                }}
              />
            </>
          }
        >
          <RelationField
            placeholder={placeholderField}
            updateObject={updateObject}
            disabled={isDisabled}
            isRequired={isRequired}
            field={field}
            errors={errors}
            control={control}
            name={computedSlug}
            setFormValue={setFormValue}
            isMulti={field?.relation_type === "Many2Many"}
          />
        </Suspense>
      );
    }
    case "MULTI_LINE":
      return (
        <MultiLineInput
          isDisabled={isDisabled}
          placeholder={placeholderField}
          control={control}
          name={computedSlug}
          field={field}
          watch={watch}
          updateObject={updateObject}
          isRequired={isRequired}
        />
      );
    case "DATE":
      return (
        <HFDatePickerField
          placeholder={placeholderField}
          updateObject={updateObject}
          disabled={isDisabled}
          field={field}
          control={control}
          name={computedSlug}
          drawerDetail={drawerDetail}
          setFormValue={setFormValue}
          required={isRequired}
        />
      );

    case "DATE_TIME":
      return (
        <HFDateTimePickerField
          placeholder={placeholderField}
          disabled={isDisabled}
          field={field}
          control={control}
          name={computedSlug}
          drawerDetail={drawerDetail}
          updateObject={updateObject}
          required={isRequired}
        />
      );
    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return (
        <HFDateDatePickerWithoutTimeZoneTableField
          placeholder={placeholderField}
          disabled={isDisabled}
          field={field}
          control={control}
          name={computedSlug}
          drawerDetail={true}
          updateObject={updateObject}
          required={isRequired}
        />
      );
    case "TIME":
      return (
        <HFTimePickerField
          placeholder={placeholderField}
          disabled={isDisabled}
          control={control}
          name={computedSlug}
          field={field}
          drawerDetail={drawerDetail}
          updateObject={updateObject}
          required={isRequired}
        />
      );

    case "PASSWORD":
      return (
        <InputField
          placeholder={placeholderField}
          disabled={isDisabled}
          type="password"
          control={control}
          name={computedSlug}
          updateObject={updateObject}
          isRequired={isRequired}
        />
      );

    case "SWITCH":
      return (
        <HFSwitch
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={computedSlug}
          updateObject={updateObject}
          isNewTableView={true}
          required={isRequired}
        />
      );

    case "VIDEO":
      return (
        <HFVideoUpload
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={computedSlug}
          updateObject={updateObject}
          isNewTableView={true}
          required={isRequired}
        />
      );

    case "CHECKBOX":
      return (
        <HFCheckbox
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={computedSlug}
          updateObject={updateObject}
          isNewTableView={true}
        />
      );

    case "STATUS":
      return (
        <HFStatusField
          placeholder={placeholderField}
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={computedSlug}
          field={field}
          updateObject={updateObject}
        />
      );

    case "MULTISELECT":
      return (
        <HFMultipleAutocomplete
          disabled={isDisabled}
          control={control}
          name={computedSlug}
          field={field}
          placeholder={placeholderField}
          updateObject={updateObject}
          required={isRequired}
        />
      );

    case "PHOTO":
      return (
        <HFPhotoUpload
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={computedSlug}
          field={field}
          updateObject={updateObject}
          isNewTableView
          required={isRequired}
        />
      );

    case "MULTI_IMAGE":
      return (
        <HFMultiImage
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          isTableView={true}
          control={control}
          name={computedSlug}
          field={field}
          updateObject={updateObject}
          required={isRequired}
        />
      );

    case "MULTI_FILE":
      return (
        <HFMultiFile
          disabled={isDisabled}
          drawerDetail={true}
          isTableView={true}
          control={control}
          name={computedSlug}
          field={field}
          updateObject={updateObject}
          required={isRequired}
        />
      );

    case "LINK":
      return (
        <HFLinkField
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={computedSlug}
          field={field}
          placeholder={placeholderField}
          isNewTableView={true}
          updateObject={updateObject}
          required={isRequired}
        />
      );

    case "NUMBER":
    case "FLOAT":
      return (
        <NumberField
          disabled={isDisabled}
          control={control}
          name={computedSlug}
          field={field}
          placeholder={placeholderField}
          updateObject={updateObject}
          required={isRequired}
        />
      );

    case "FILE":
      return (
        <HFFileUpload
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={computedSlug}
          field={field}
          isNewTableView={true}
          updateObject={updateObject}
          required={isRequired}
        />
      );

    case "MAP":
      return (
        <HFModalMap
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={computedSlug}
          field={field}
          placeholder={placeholderField}
          isNewTableView={true}
          updateObject={updateObject}
          required={isRequired}
        />
      );
    case "POLYGON":
      return (
        <PolygonFieldTable
          placeholder={placeholderField}
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          computedSlug={computedSlug}
          field={field}
          setValue={setFormValue}
          isNewTableView={true}
          updateObject={updateObject}
        />
      );

    case "ICON":
      return (
        <HFIconPicker
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={computedSlug}
          field={field}
          isNewTableView={true}
          updateObject={updateObject}
          required={isRequired}
        />
      );
    case "COLOR":
      return (
        <HFColorPicker
          disabled={isDisabled}
          drawerDetail={drawerDetail}
          control={control}
          name={computedSlug}
          field={field}
          isNewTableView={true}
          updateObject={updateObject}
          required={isRequired}
        />
      );

    case "FORMULA_FRONTEND":
      return (
        <FormulaField
          placeholder={placeholderField}
          disabled={isDisabled}
          control={control}
          name={computedSlug}
          field={field}
          isNewTableView={true}
          updateObject={updateObject}
          required={isRequired}
        />
      );

    case "INTERNATION_PHONE":
      return (
        <HFInternationalPhone
          placeholder={placeholderField}
          disabled={isDisabled}
          control={control}
          name={computedSlug}
          updateObject={updateObject}
          required={isRequired}
        />
      );

    case FIELD_TYPES.SINGLE_LINE:
      return (
        <InputField
          placeholder={placeholderField}
          watch={watch}
          disabled={isDisabled}
          control={control}
          name={computedSlug}
          field={field}
          errors={errors}
          functions={functions}
          isTextarea={true}
          updateObject={updateObject}
          isRequired={isRequired}
        />
      );

    default:
      return (
        <InputField
          placeholder={placeholderField}
          watch={watch}
          disabled={isDisabled}
          control={control}
          name={computedSlug}
          field={field}
          errors={errors}
          functions={functions}
          updateObject={updateObject}
          isRequired={isRequired}
        />
      );
  }
}

const InputField = ({
  control,
  name = "",
  type = "text",
  disabled = false,
  watch = () => {},
  errors,
  functions,
  field,
  isTextarea,
  placeholder = "Empty",
  updateObject = () => {},
  isRequired,
}) => {
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "31px";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    if (isTextarea) {
      resizeTextarea();
    }
  }, [watch(name)]);

  const inputValue =
    watch(name) ||
    functions?.find((fn) => fn?.value === field?.attributes?.function)?.label;

  const inputType = field?.type === "EMAIL" ? "email" : type;

  const isDisabled =
    disabled || field?.type === "BUTTON" || field?.type === "INCREMENT_ID";

  const inputChangeHandler = useDebounce(() => updateObject(), 700);
console.log({ isRequired });
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        pattern: {
          value: field?.type === "EMAIL" ? /\S+@\S+\.\S+/ : undefined,
          message:
            field?.type === "EMAIL" ? "Incorrect email format" : undefined,
        },
        required: {
          value: isRequired,
          message: "This is required field",
        },
      }}
      render={({ field: { onChange, value } }) => {
        return (
          <ChakraProvider>
            <ChakraBox position="relative">
              <InputGroup>
                {isTextarea ? (
                  <textarea
                    ref={textareaRef}
                    disabled={isDisabled}
                    value={inputValue ?? value}
                    onChange={(e) => {
                      onChange(e.target.value);
                      inputChangeHandler();
                    }}
                    placeholder={placeholder}
                    className={cls.singleLine}
                  />
                ) : (
                  <Input
                    disabled={isDisabled}
                    type={inputType}
                    value={inputValue ?? value}
                    onChange={(e) => {
                      onChange(e.target.value);
                      inputChangeHandler();
                    }}
                    placeholder={
                      field?.type === "INCREMENT_ID"
                        ? "Increment ID"
                        : placeholder
                    }
                    height="38px"
                    fontSize="13px"
                    px={"9.6px"}
                    width="100%"
                    border="none"
                    borderRadius={"4px"}
                    _hover={{
                      bg: "#F7F7F7",
                    }}
                    _placeholder={{
                      color: "#adb5bd",
                    }}
                    _focus={{
                      backgroundColor: "#F7F7F7",
                      border: "none",
                      outline: "none",
                    }}
                  />
                )}
                {isDisabled && (
                  <InputRightElement pointerEvents="none">
                    <Lock style={{ fontSize: "20px", color: "#adb5bd" }} />
                  </InputRightElement>
                )}
              </InputGroup>
              {errors?.[name] && (
                <span
                  style={{
                    color: "#FF4842",
                    fontSize: "10px",
                    position: "absolute",
                    bottom: "-5px",
                    left: "0",
                    paddingLeft: "9.6px",
                  }}
                >
                  {errors?.[name]?.message}
                </span>
              )}
            </ChakraBox>
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
  updateObject = () => {},
  required,
}) => {
  const inputChangeHandler = useDebounce(() => updateObject(), 700);

  const handleChange = (event, onChange = () => {}) => {
    const inputValue = event.target.value.replace(/\s+/g, "");
    const parsedValue = inputValue ? parseFloat(inputValue) : "";

    if (parsedValue || parsedValue === 0) {
      onChange(parsedValue);
      inputChangeHandler();
    } else {
      onChange("");
      inputChangeHandler();
    }
  };
  return (
    <Box position="relative">
      <Controller
        control={control}
        name={name}
        rules={{
          required: required ? "This is required field" : false,
        }}
        render={({ field: { onChange, value } }) => {
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
                cursor: disabled ? "not-allowed" : "text",
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
      {disabled && (
        <Box
          sx={{
            width: "2.5rem",
            height: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <Lock style={{ fontSize: "20px", color: "#adb5bd" }} />
        </Box>
      )}
    </Box>
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
  placeholder = "",
  updateObject = () => {},
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
          placeholder={placeholder}
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

            if (!valueWithoutSpaces) {
              onChange("");
              updateObject();
            } else {
              onChange(
                !isNaN(Number(valueWithoutSpaces))
                  ? Number(valueWithoutSpaces)
                  : ""
              );
            }
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
