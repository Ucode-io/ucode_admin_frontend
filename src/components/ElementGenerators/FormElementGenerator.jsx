import { Lock } from "@mui/icons-material";
import { InputAdornment, Tooltip } from "@mui/material";
import { Parser } from "hot-formula-parser";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import FRow from "../FormElements/FRow";
import HFAutocomplete from "../FormElements/HFAutocomplete";
import HFCheckbox from "../FormElements/HFCheckbox";
import HFDatePicker from "../FormElements/HFDatePicker";
import HFDateTimePicker from "../FormElements/HFDateTimePicker";
import HFDentist from "../FormElements/HFDentist";
import HFFileUpload from "../FormElements/HFFileUpload";
import HFFloatField from "../FormElements/HFFloatField";
import HFFormulaField from "../FormElements/HFFormulaField";
import HFIconPicker from "../FormElements/HFIconPicker";
import HFImageUpload from "../FormElements/HFImageUpload";
import HFInternationPhone from "../FormElements/HFInternationPhone";
import HFMapField from "../FormElements/HFMapField";
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete";
import HFNumberField from "../FormElements/HFNumberField";
import HFSwitch from "../FormElements/HFSwitch";
import HFTextEditor from "../FormElements/HFTextEditor";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask";
import HFTimePicker from "../FormElements/HFTimePicker";
import HFVideoUpload from "../FormElements/HFVideoUpload";
import InventoryBarCode from "../FormElements/InventoryBarcode";
import BarcodeGenerator from "./BarcodeGenerator";
import CodabarBarcode from "./CodabarBarcode";
import DynamicRelationFormElement from "./DynamicRelationFormElement";
import ManyToManyRelationFormElement from "./ManyToManyRelationFormElement";
import RelationFormElement from "./RelationFormElement";

const parser = new Parser();

const FormElementGenerator = ({
  field = {},
  control,
  setFormValue,
  formTableSlug,
  activeLang,
  fieldsList,
  checkPermission = true,
  isMultiLanguage,
  relatedTable,
  ...props
}) => {
  const isUserId = useSelector((state) => state?.auth?.userId);
  const tables = useSelector((state) => state?.auth?.tables);
  let relationTableSlug = "";
  let objectIdFromJWT = "";
  if (field?.id?.includes("#")) {
    relationTableSlug = field?.id?.split("#")[0];
  }

  const label = useMemo(() => {
    if (field?.enable_multilanguage) {
      return field?.attributes?.show_label
        ? `${field?.label} (${activeLang})`
        : "";
    } else {
      if (field?.attributes?.show_label === false) return "";
      return field?.label ?? " ";
    }
  }, [field, activeLang]);

  tables?.forEach((table) => {
    if (table?.table_slug === relationTableSlug) {
      objectIdFromJWT = table?.object_id;
    }
  });

  const computedSlug = useMemo(() => {
    if (field?.enable_multilanguage) {
      return `${field?.slug?.split("_")?.[0]}_${activeLang}`;
    }
    if (field.id?.includes("@")) {
      return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
    }

    return field?.slug;
  }, [field?.id, field?.slug, field?.enable_multilanguage, activeLang]);

  const defaultValue = useMemo(() => {
    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;
    if (field?.attributes?.is_user_id_default === true) return isUserId;

    const defaultValue =
      field.attributes?.defaultValue ?? field.attributes?.default_values;

    if (!defaultValue) return undefined;
    if (field.relation_type === "Many2One") return defaultValue[0];
    if (field.type === "MULTISELECT" || field.id?.includes("#"))
      return defaultValue;

    const { error, result } = parser.parse(defaultValue);
    return error ? undefined : result;
  }, [
    field.attributes,
    field.type,
    field.id,
    field.relation_type,
    objectIdFromJWT,
    isUserId,
  ]);

  const isDisabled = useMemo(() => {
    return (
      field.attributes?.disabled ||
      !field.attributes?.field_permission?.edit_permission
    );
  }, [field]);

  if (!field.attributes?.field_permission?.view_permission && checkPermission) {
    return null;
  }

  if (field?.id?.includes("#")) {
    if (field?.relation_type === "Many2Many") {
      return (
        <ManyToManyRelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );
    } else if (field?.relation_type === "Many2Dynamic") {
      return (
        <DynamicRelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );
    } else {
      return (
        <RelationFormElement
          control={control}
          field={field}
          name={computedSlug}
          setFormValue={setFormValue}
          formTableSlug={formTableSlug}
          defaultValue={defaultValue}
          disabled={isDisabled}
          key={computedSlug}
          {...props}
        />
      );
    }
  }

  switch (field.type) {
    case "SCAN_BARCODE":
      return (
        <FRow label={label} required={field.required}>
          <InventoryBarCode
            relatedTable={relatedTable}
            control={control}
            name={computedSlug}
            fullWidth
            setFormValue={setFormValue}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            field={field}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FRow>
      );
    case "SINGLE_LINE":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field?.attributes?.show_label ? "" : field.label}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            rules={{
              pattern: {
                value: new RegExp(field?.attributes?.validation),
                message: field?.attributes?.validation_message,
              },
            }}
            {...props}
          />
        </FRow>
      );

    case "PHONE":
      return (
        <FRow label={label} required={field.required}>
          <HFTextFieldWithMask
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field?.attributes?.show_label ? "" : field.label}
            mask={"(99) 999-99-99"}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "INTERNATIONAL_PHONE":
      return (
        <FRow label={label} required={field.required}>
          <HFInternationPhone
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            mask={"(99) 999-99-99"}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "INTERNATION_PHONE":
      return (
        <FRow label={label} required={field.required}>
          <HFInternationPhone
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            mask={"(99) 999-99-99"}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "PICK_LIST":
      return (
        <FRow label={label} required={field.required}>
          <HFAutocomplete
            control={control}
            tabIndex={field?.tabIndex}
            name={computedSlug}
            width="100%"
            options={field?.attributes?.options}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FRow>
      );

    case "MULTI_LINE":
      return (
        <FRow label={label} required={field.required}>
          <HFTextEditor
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            multiline
            rows={4}
            required={field.required}
            placeholder={field?.attributes?.show_label ? "" : field.label}
            defaultValue={field.defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FRow>
      );

    case "DATE":
      return (
        <FRow label={label} required={field.required}>
          <HFDatePicker
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            width={"100%"}
            mask={"99.99.9999"}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "DATE_TIME":
      return (
        <FRow label={label} required={field.required}>
          <HFDateTimePicker
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            mask={"99.99.9999"}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "TIME":
      return (
        <FRow label={label} required={field.required}>
          <HFTimePicker
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "NUMBER":
      return (
        <FRow label={label} required={field.required}>
          <HFNumberField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            type="number"
            required={field.required}
            placeholder={field?.attributes?.show_label ? "" : field.label}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );
    case "FLOAT":
      return (
        <FRow label={label} required={field.required}>
          <HFFloatField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            type="number"
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FRow>
      );

    case "CHECKBOX":
      return (
        <HFCheckbox
          control={control}
          name={computedSlug}
          tabIndex={field?.tabIndex}
          label={label}
          required={field.required}
          defaultValue={defaultValue}
          disabled={isDisabled}
          key={computedSlug}
          {...props}
        />
      );

    case "MULTISELECT":
      return (
        <FRow label={label} required={field.required}>
          <HFMultipleAutocomplete
            control={control}
            name={computedSlug}
            width="100%"
            required={field.required}
            field={field}
            tabIndex={field?.tabIndex}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FRow>
      );

    case "SWITCH":
      return (
        <HFSwitch
          control={control}
          name={computedSlug}
          label={label}
          tabIndex={field?.tabIndex}
          required={field.required}
          defaultValue={defaultValue}
          disabled={isDisabled}
          key={computedSlug}
          {...props}
        />
      );

    case "EMAIL":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            rules={{
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Incorrect email format",
              },
            }}
            fullWidth
            required={field.required}
            placeholder={field?.attributes?.show_label ? "" : field.label}
            defaultValue={defaultValue}
            tabIndex={field?.tabIndex}
            disabled={isDisabled}
            key={computedSlug}
            {...props}
          />
        </FRow>
      );

    case "PHOTO":
      return (
        <FRow label={label} required={field.required}>
          <HFImageUpload
            control={control}
            name={computedSlug}
            key={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );
    case "MAP":
      return (
        <FRow label={label} required={field.required}>
          <HFMapField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            field={field}
            {...props}
          />
        </FRow>
      );

    case "VIDEO":
      return (
        <FRow label={label} required={field.required}>
          <HFVideoUpload
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );
    case "FILE":
      return (
        <FRow label={label} required={field.required}>
          <HFFileUpload
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "BARCODE":
      return (
        <FRow label={label} required={field.required}>
          <BarcodeGenerator
            control={control}
            field={field}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            // disabled={isDisabled}
            formTableSlug={formTableSlug}
            {...props}
          />
        </FRow>
      );

    case "CODABAR":
      return (
        <FRow label={label} required={field.required}>
          <CodabarBarcode
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            field={field}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            // disabled={isDisabled}
            formTableSlug={formTableSlug}
            {...props}
          />
        </FRow>
      );

    case "DENTIST":
      return (
        <FRow label={label} required={field.required}>
          <HFDentist
            control={control}
            name={computedSlug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            tabIndex={field?.tabIndex}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    // case "CUSTOM_IMAGE":
    //   return (
    //     <FRow label={field.label} required={field.required}>
    //       <HFCustomImage
    //         control={control}
    //         name={computedSlug}
    //         fullWidth
    //         required={field.required}
    //         placeholder={field.attributes?.placeholder}
    //         defaultValue={defaultValue}
    //         tabIndex={field?.tabIndex}
    //         disabled={isDisabled}
    //         {...props}
    //       />
    //     </FRow>
    //   );

    case "ICON":
      return (
        <FRow label={label} required={field.required}>
          <HFIconPicker
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "FORMULA":
    case "INCREMENT_ID":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            InputProps={{
              readOnly: true,
              style: {
                background: "#c0c0c039",
              },
            }}
            {...props}
          />
        </FRow>
      );
    case "INCREMENT_NUMBER":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            InputProps={{
              readOnly: true,
              style: {
                background: "#c0c0c039",
              },
            }}
            {...props}
          />
        </FRow>
      );

    case "FORMULA_FRONTEND":
      return (
        <FRow label={label} required={field.required}>
          <HFFormulaField
            setFormValue={setFormValue}
            control={control}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fieldsList={fieldsList}
            field={field}
            defaultValue={defaultValue}
          />
        </FRow>
      );

    case "COLOR":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            type="color"
            key={computedSlug}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "PASSWORD":
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field?.attributes?.show_label ? "" : field.label}
            defaultValue={defaultValue}
            disabled={field.attributes?.disabled}
            type="password"
            {...props}
          />
        </FRow>
      );

    default:
      return (
        <FRow label={label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            key={computedSlug}
            tabIndex={field?.tabIndex}
            fullWidth
            required={field.required}
            placeholder={field?.attributes?.show_label ? "" : field.label}
            defaultValue={defaultValue}
            disabled={isDisabled}
            InputProps={{
              style: isDisabled
                ? {
                    background: "#c0c0c039",
                    paddingRight: "0px",
                  }
                : {
                    background: "inherit",
                    color: "inherit",
                  },

              endAdornment: isDisabled && (
                <Tooltip title="This field is disabled for this role!">
                  <InputAdornment position="start">
                    <Lock style={{ fontSize: "20px" }} />
                  </InputAdornment>
                </Tooltip>
              ),
            }}
            {...props}
          />
        </FRow>
      );
  }
};

export default FormElementGenerator;
