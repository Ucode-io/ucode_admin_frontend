import {Parser} from "hot-formula-parser";
import {useEffect, useMemo} from "react";
import {useWatch} from "react-hook-form";
import {useSelector} from "react-redux";
import CHFFormulaField from "../FormElements/CHFFormulaField";
import HFAutocomplete from "../FormElements/HFAutocomplete";
import HFCheckbox from "../FormElements/HFCheckbox";
import HFDatePicker from "../FormElements/HFDatePicker";
import HFDateTimePicker from "../FormElements/HFDateTimePicker";
import HFFormulaField from "../FormElements/HFFormulaField";
import HFIconPicker from "../FormElements/HFIconPicker";
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete";
import HFNumberField from "../FormElements/HFNumberField";
import HFSwitch from "../FormElements/HFSwitch";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask";
import HFTimePicker from "../FormElements/HFTimePicker";
import CellElementGenerator from "./CellElementGenerator";
import CellManyToManyRelationElement from "./CellManyToManyRelationElement";
import CellRelationFormElement from "./CellRelationFormElement";
import HFFloatField from "../FormElements/HFFloatField";
import InventoryBarCode from "../FormElements/InventoryBarcode";
import HFPassword from "../FormElements/HFPassword";
import HFModalMap from "../FormElements/HFModalMap";
import HFTextEditor from "../FormElements/HFTextEditor";
import HFColorPicker from "../FormElements/HFColorPicker";
import HFFileUpload from "../FormElements/HFFileUpload";
import HFVideoUpload from "../FormElements/HFVideoUpload";
import MultiLineCellFormElement from "./MultiLineCellFormElement";
import {useTranslation} from "react-i18next";

const parser = new Parser();

const NewCellElementGenerator = ({
  field,
  fields,
  isBlackBg = false,
  watch,
  columns = [],
  row,
  updateObject,
  control,
  setFormValue,
  shouldWork = false,
  index,
  relationfields,
  data,
  ...props
}) => {
  const selectedRow = useSelector((state) => state.selectedRow.selected);
  const userId = useSelector((state) => state.auth.userId);
  const tables = useSelector((state) => state.auth.tables);
  const {i18n} = useTranslation();
  let relationTableSlug = "";
  let objectIdFromJWT = "";

  if (field?.id.includes("#")) {
    relationTableSlug = field?.id.split("#")[0];
  }

  tables?.forEach((table) => {
    if (table.table_slug === relationTableSlug) {
      objectIdFromJWT = table.object_id;
    }
  });

  // const computedSlug = useMemo(
  //   () => `multi.${index}.${field.slug}`,
  //   [field.slug, index]
  // );

  const removeLangFromSlug = (slug) => {
    var lastIndex = field.slug.lastIndexOf("_");
    if (lastIndex !== -1) {
      var result = field.slug.substring(0, lastIndex);
      return result;
    } else {
      return false;
    }
  };

  const computedSlug = useMemo(() => {
    if (field?.enable_multilanguage) {
      return `${removeLangFromSlug(field.slug)}_${i18n}`;
    }

    if (field.id?.includes("@")) {
      return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
    }

    return `multi.${index}.${field.slug}`;
  }, [field?.id, field?.slug, , i18n, field?.enable_multilanguage]);

  const changedValue = useWatch({
    control,
    name: computedSlug,
  });

  const isDisabled = useMemo(() => {
    return (
      field.attributes?.disabled ||
      !field.attributes?.field_permission?.edit_permission
    );
  }, [field]);

  const defaultValue = useMemo(() => {
    const defaultValue =
      field.attributes?.defaultValue ?? field.attributes?.default_values;
    if (field?.attributes?.is_user_id_default === true) return userId;
    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;
    if (field.relation_type === "Many2One" || field?.type === "LOOKUP") {
      if (Array.isArray(defaultValue)) {
        return defaultValue[0];
      } else {
        return defaultValue;
      }
    }
    if (field.type === "MULTISELECT" || field.id?.includes("#"))
      return defaultValue;
    if (!defaultValue) return undefined;
    const {error, result} = parser.parse(defaultValue);
    return error ? undefined : result;
  }, [field.attributes, field.type, field.id, field.relation_type]);

  useEffect(() => {
    if (!row?.[field.slug]) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || defaultValue);
    }
  }, [field, row, setFormValue, computedSlug]);

  useEffect(() => {
    if (columns.length && changedValue !== undefined && changedValue !== null) {
      columns.forEach(
        (i, rowIndex) =>
          selectedRow.includes(i.guid) &&
          setFormValue(`multi.${rowIndex}.${field.slug}`, changedValue)
      );
    }
  }, [changedValue, setFormValue, columns, field, selectedRow]);

  let watchValue = useWatch({
    control,
    name: computedSlug,
  });

  // useEffect(() => {
  //   updateObject();
  // }, [changedValue])

  switch (field.type) {
    case "LOOKUP":
      return (
        <CellRelationFormElement
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          updateObject={updateObject}
          isNewTableView={true}
          control={control}
          name={computedSlug}
          field={field}
          row={row}
          placeholder={field.attributes?.placeholder}
          setFormValue={setFormValue}
          index={index}
          defaultValue={defaultValue}
          relationfields={relationfields}
          data={data}
        />
      );

    case "LOOKUPS":
      return (
        <CellManyToManyRelationElement
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          field={field}
          row={row}
          placeholder={field.attributes?.placeholder}
          setFormValue={setFormValue}
          index={index}
          defaultValue={defaultValue}
        />
      );

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
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
          defaultValue={defaultValue}
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
          {...props}
          defaultValue={defaultValue}
        />
      );

    case "SCAN_BARCODE":
      return (
        <InventoryBarCode
          // relatedTable={relatedTable}
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
          {...props}
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
          {...props}
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
          {...props}
        />
      );
    case "FORMULA_FRONTEND":
      return (
        <CHFFormulaField
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
          {...props}
          defaultValue={defaultValue}
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
          {...props}
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
          {...props}
        />
      );
    case "MULTISELECT_V2":
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
          {...props}
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
          {...props}
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
          {...props}
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
          {...props}
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
          {...props}
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
          {...props}
        />
      );

    case "CHECKBOX":
      return (
        <HFCheckbox
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "SWITCH":
      return (
        <HFSwitch
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          defaultValue={defaultValue}
          {...props}
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
          {...props}
        />
      );

    case "ICON":
      return (
        <HFIconPicker
          isFormEdit
          control={control}
          updateObject={updateObject}
          isNewTableView={true}
          name={computedSlug}
          required={field.required}
          defaultValue={defaultValue}
          {...props}
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

    case "MULTI_LINE":
      return (
        // <HFTextEditor
        //   control={control}
        //   name={computedSlug}
        //   tabIndex={field?.tabIndex}
        //   fullWidth
        //   multiline
        //   rows={4}
        //   defaultValue={field.defaultValue}
        //   disabled={isDisabled}
        //   key={computedSlug}
        //   isTransparent={true}
        //   {...props}
        // />

        <MultiLineCellFormElement
          control={control}
          updateObject={updateObject}
          isNewTableView={true}
          computedSlug={computedSlug}
          field={field}
          isDisabled={isDisabled}
          {...props}
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
          {...props}
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
          {...props}
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
          {...props}
        />
      );

    case "COLOR":
      return (
        <HFColorPicker
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
          {...props}
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

export default NewCellElementGenerator;
