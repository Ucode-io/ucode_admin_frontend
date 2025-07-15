import HFCheckbox from "@/views/table-redesign/hf-checkbox";
import {
  HFDateDatePickerWithoutTimeZoneTable,
  HFDatePicker,
  HFDateTimePicker,
  HFTimePicker,
} from "@/views/table-redesign/hf-date";
import HFSwitch from "@/views/table-redesign/hf-switch";
import {HFVideoUpload} from "@/views/table-redesign/hf-video-upload";
import {Parser} from "hot-formula-parser";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import HFAutocomplete from "../FormElements/HFAutocomplete";
import HFButtonField from "../FormElements/HFButtonField";
import HFColorPicker from "../FormElements/HFColorPicker";
import HFFileUpload from "../FormElements/HFFileUpload";
import HFFloatField from "../FormElements/HFFloatField";
import HFFormulaField from "../FormElements/HFFormulaField";
import HFIconPicker from "../FormElements/HFIconPicker";
import HFInternationPhone from "../FormElements/HFInternationPhone";
import HFLinkField from "../FormElements/HFLinkField";
import HFModalMap from "../FormElements/HFModalMap";
import HFMultiFile from "../FormElements/HFMultiFile";
import HFMultiImage from "../FormElements/HFMultiImage";
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete";
import HFNumberField from "../FormElements/HFNumberField";
import HFPassword from "../FormElements/HFPassword";
import HFPhotoUpload from "../FormElements/HFPhotoUpload";
import HFQrFieldComponent from "../FormElements/HFQrField";
import HFStatusField from "../FormElements/HFStatusField";
import HFTextComponent from "../FormElements/HFTextComponent";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask";
import InventoryBarCode from "../FormElements/InventoryBarcode";
import NewCHFFormulaField from "../FormElements/NewCHFormulaField";
import CellElementGenerator from "./CellElementGenerator";
import MultiLineCellFormElement from "./MultiLineCellFormElement";
import PolygonFieldTable from "./PolygonFieldTable";

const parser = new Parser();

const CellElementGeneratorForTableView = ({
  row,
  data,
  field,
  index,
  watch,
  fields,
  control,
  isWrapField,
  isNewRow = false,
  newColumn = false,
  isBlackBg = false,
  isTableView = false,
  setFormValue = () => {},
  updateObject = () => {},
  newUi,
}) => {
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  const [objectIdFromJWT, setObjectIdFromJWT] = useState();
  const {i18n} = useTranslation();
  let relationTableSlug = "";

  if (field?.id.includes("#")) {
    relationTableSlug = field?.id.split("#")[0];
  } else if (field?.type === "LOOKUP") {
    relationTableSlug = field?.table_slug;
  }

  const computedSlug = useMemo(() => {
    if (!isNewRow) {
      if (field?.enable_multilanguage) {
        return `multi.${index}.${field.slug}`;
      } else if (field.id?.includes("@")) {
        return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
      }

      return `multi.${index}.${field.slug}`;
    } else {
      if (field?.enable_multilanguage) {
        return `${field.slug}`;
      } else if (field.id?.includes("@")) {
        return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
      }

      return `${field.slug}`;
    }
  }, [field, i18n?.language]);

  const isDisabled =
    field.attributes?.disabled ||
    !field.attributes?.field_permission?.edit_permission;

  const defaultValue = useMemo(() => {
    const defaultValue =
      field.attributes?.defaultValue || field.attributes?.default_values;

    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;
    if (field?.attributes?.is_user_id_default === true) return userId;

    if (field.type === "MULTISELECT" || field.id?.includes("#"))
      return defaultValue;

    if (field.relation_type === "Many2One" || field?.type === "LOOKUP") {
      if (Array.isArray(defaultValue)) {
        return defaultValue[0];
      } else {
        return defaultValue;
      }
    }
    if (field?.type === "SWITCH") {
      return false;
    }
    if (field.relation_type !== "Many2One" || field?.type !== "LOOKUP") {
      if (Array.isArray(defaultValue)) {
        return defaultValue[0];
      } else {
        return defaultValue;
      }
    }

    if (!defaultValue) return undefined;

    const {error, result} = parser.parse(defaultValue);

    return error ? undefined : result;
  }, [field, objectIdFromJWT]);

  useEffect(() => {
    tables?.forEach((table) => {
      if (table.table_slug === relationTableSlug) {
        setObjectIdFromJWT(table?.object_id);
      }
    });
  }, [tables, relationTableSlug, field]);

  useEffect(() => {
    if (!row?.[field.slug]) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || defaultValue);
    }
  }, [row, computedSlug, defaultValue]);
  switch (field.type) {
    case "SINGLE_LINE":
      return (
        <HFTextField
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          field={field}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          rules={{
            pattern: {
              value: new RegExp(field?.attributes?.validation),
              message: field?.attributes?.validation_message,
            },
          }}
        />
      );

    case "LINK":
      return (
        <HFLinkField
          isFormEdit
          disabled={isDisabled}
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          field={field}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
        />
      );

    case "TEXT":
      return <HFTextComponent isTableView={true} field={field} />;

    case "BUTTON":
      return <HFButtonField field={field} row={row} isTableView={true} />;

    case "STATUS":
      return (
        <HFStatusField
          field={field}
          row={row}
          isTableView={true}
          control={control}
          name={computedSlug}
          updateObject={updateObject}
          newUi={newUi}
          disabled={isDisabled}
        />
      );

    case "PASSWORD":
      return (
        <HFPassword
          isDisabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          field={field}
          isTransparent={true}
          required={field.required}
          type="password"
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          newUi={newUi}
        />
      );

    case "SCAN_BARCODE":
      return (
        <InventoryBarCode
          control={control}
          name={computedSlug}
          fullWidth
          updateObject={updateObject}
          isNewTableView={true}
          setFormValue={setFormValue}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          field={field}
          disabled={isDisabled}
        />
      );
    case "PHONE":
      return (
        <HFTextFieldWithMask
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          isTransparent={true}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          mask={"(99) 999-99-99"}
          defaultValue={defaultValue}
        />
      );

    case "PHOTO":
      return (
        <HFPhotoUpload
          disabled={isDisabled}
          isFormEdit
          field={field}
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          isTransparent={true}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
        />
      );

    case "MULTI_IMAGE":
      return (
        <HFMultiImage
          disabled={isDisabled}
          isFormEdit
          field={field}
          isTableView={true}
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          isTransparent={true}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          newUi={newUi}
        />
      );

    case "MULTI_FILE":
      return (
        <HFMultiFile
          disabled={isDisabled}
          isFormEdit
          field={field}
          isTableView={true}
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          isTransparent={true}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          newUi={newUi}
        />
      );

    case "FORMULA":
      return (
        <HFFormulaField
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          mask={"(99) 999-99-99"}
          defaultValue={defaultValue}
          isTransparent={true}
        />
      );
    case "FORMULA_FRONTEND":
      return (
        <NewCHFFormulaField
          setFormValue={setFormValue}
          control={control}
          updateObject={updateObject}
          isNewTableView={true}
          isTableView={true}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          name={computedSlug}
          fieldsList={fields}
          disabled={!isDisabled}
          isTransparent={true}
          field={field}
          index={index}
          defaultValue={defaultValue}
          newUi={newUi}
        />
      );

    case "PICK_LIST":
      return (
        <HFAutocomplete
          disabled={isDisabled}
          isBlackBg={isBlackBg}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          control={control}
          name={computedSlug}
          width="100%"
          options={field?.attributes?.options}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
        />
      );

    case "INTERNATION_PHONE":
      return (
        <HFInternationPhone
          control={control}
          isBlackBg={isBlackBg}
          isTableView={isTableView}
          name={computedSlug}
          tabIndex={field?.tabIndex}
          updateObject={updateObject}
          isNewTableView={true}
          fullWidth
          required={field?.required}
          placeholder={field.attributes?.placeholder}
          mask={"(99) 999-99-99"}
          defaultValue={defaultValue}
          disabled={isDisabled}
          newUi={newUi}
        />
      );

    case "MULTISELECT":
      return (
        <HFMultipleAutocomplete
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          control={control}
          name={computedSlug}
          width="100%"
          required={field.required}
          field={field}
          placeholder={field.attributes?.placeholder}
          isBlackBg={isBlackBg}
          defaultValue={defaultValue}
          data={data}
          newUi={newUi}
        />
      );

    case "DATE":
      return (
        <HFDatePicker
          control={control}
          name={computedSlug}
          fullWidth
          updateObject={updateObject}
          isNewTableView={true}
          width={"100%"}
          mask={"99.99.9999"}
          isFormEdit
          isBlackBg={isBlackBg}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          disabled={isDisabled}
          isTransparent={true}
        />
      );

    case "DATE_TIME":
      return (
        <HFDateTimePicker
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          showCopyBtn={false}
          control={control}
          name={computedSlug}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          isTransparent={true}
        />
      );

    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return (
        <HFDateDatePickerWithoutTimeZoneTable
          control={control}
          name={computedSlug}
          tabIndex={field?.tabIndex}
          updateObject={updateObject}
          isTableView={isTableView}
          mask={"99.99.9999"}
          required={field?.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          disabled={isDisabled}
          isNewTableView={true}
          field={field}
        />
      );

    case "TIME":
      return (
        <HFTimePicker
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          isTransparent={true}
        />
      );

    case "NUMBER":
      return (
        <HFNumberField
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          isBlackBg={isBlackBg}
          defaultValue={defaultValue}
          isTransparent={true}
          newColumn={newColumn}
          newUi={newUi}
        />
      );
    case "FLOAT":
      return (
        <HFFloatField
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          isBlackBg={isBlackBg}
          defaultValue={defaultValue}
          isTransparent={true}
          newUi={newUi}
        />
      );

    case "CHECKBOX":
      return (
        <HFCheckbox
          field={field}
          newColumn={newColumn}
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          defaultValue={defaultValue}
          newUi={newUi}
        />
      );

    case "SWITCH":
      return (
        <HFSwitch
          newColumn={newColumn}
          disabled={isDisabled}
          isFormEdit
          field={field}
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          defaultValue={defaultValue}
        />
      );

    case "EMAIL":
      return (
        <HFTextField
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
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
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
        />
      );

    case "ICON":
      return (
        <HFIconPicker
          isFormEdit
          disabled={isDisabled}
          control={control}
          updateObject={updateObject}
          isNewTableView={true}
          name={computedSlug}
          required={field.required}
          defaultValue={defaultValue}
        />
      );
    case "MAP":
      return (
        <HFModalMap
          isTransparent={true}
          control={control}
          updateObject={updateObject}
          isNewTableView={true}
          field={field}
          defaultValue={defaultValue}
          isFormEdit
          name={computedSlug}
          required={field?.required}
        />
      );

    case "QR":
      return (
        <HFQrFieldComponent
          disabled={isDisabled}
          isTransparent={true}
          control={control}
          updateObject={updateObject}
          isTableView={isTableView}
          field={field}
          defaultValue={defaultValue}
          isFormEdit
          name={computedSlug}
          required={field?.required}
          newColumn={newColumn}
        />
      );

    case "POLYGON":
      return (
        <PolygonFieldTable
          field={field}
          control={control}
          updateObject={updateObject}
          computedSlug={computedSlug}
          isDisabled={isDisabled}
          isNewTableView={true}
          row={row}
          newColumn={newColumn}
        />
      );

    case "MULTI_LINE":
      return (
        <MultiLineCellFormElement
          control={control}
          isWrapField={isWrapField}
          updateObject={updateObject}
          isNewTableView={true}
          computedSlug={computedSlug}
          field={field}
          isDisabled={isDisabled}
        />
      );

    case "CUSTOM_IMAGE":
      return (
        <HFFileUpload
          isTransparent={true}
          control={control}
          updateObject={updateObject}
          isNewTableView={true}
          name={computedSlug}
          defaultValue={defaultValue}
          isFormEdit
          required={field.required}
        />
      );

    case "VIDEO":
      return (
        <HFVideoUpload
          control={control}
          updateObject={updateObject}
          isNewTableView={true}
          name={computedSlug}
          defaultValue={defaultValue}
          isFormEdit
          isBlackBg={isBlackBg}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          isTransparent={true}
        />
      );

    case "FILE":
      return (
        <HFFileUpload
          control={control}
          updateObject={updateObject}
          isNewTableView={true}
          name={computedSlug}
          defaultValue={defaultValue}
          isFormEdit
          isBlackBg={isBlackBg}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          isTransparent={true}
        />
      );

    case "COLOR":
      return (
        <HFColorPicker
          disabled={isDisabled}
          control={control}
          updateObject={updateObject}
          isNewTableView={true}
          name={computedSlug}
          defaultValue={defaultValue}
          isFormEdit
          isBlackBg={isBlackBg}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          isTransparent={true}
        />
      );

    default:
      return (
        <div style={{padding: "0 4px"}}>
          <CellElementGenerator field={field} row={row} />
        </div>
      );
  }
};

export default CellElementGeneratorForTableView;
