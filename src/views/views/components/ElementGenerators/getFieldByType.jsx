import HFCheckbox from "@/views/table-redesign/hf-checkbox";
import HFAutocomplete from "@/components/FormElements/HFAutocomplete";
import HFButtonField from "@/components/FormElements/HFButtonField";
import HFColorPicker from "@/components/FormElements/HFColorPicker";
import HFFileUpload from "@/components/FormElements/HFFileUpload";
import HFFloatField from "@/components/FormElements/HFFloatField";
import HFFormulaField from "@/components/FormElements/HFFormulaField";
import HFIconPicker from "@/components/FormElements/HFIconPicker";
import HFInternationPhone from "@/components/FormElements/HFInternationPhone";
import HFLinkField from "@/components/FormElements/HFLinkField";
import HFModalMap from "@/components/FormElements/HFModalMap";
import HFMultiFile from "@/components/FormElements/HFMultiFile";
import HFMultiImage from "@/components/FormElements/HFMultiImage";
import HFMultipleAutocomplete from "@/components/FormElements/HFMultipleAutocomplete";
import HFNumberField from "@/components/FormElements/HFNumberField";
import HFPassword from "@/components/FormElements/HFPassword";
import HFPhotoUpload from "@/components/FormElements/HFPhotoUpload";
import HFQrFieldComponent from "@/components/FormElements/HFQrField";
import HFStatusField from "@/components/FormElements/HFStatusField";
import HFTextComponent from "@/components/FormElements/HFTextComponent";
import HFTextField from "@/components/FormElements/HFTextField";
import HFTextFieldWithMask from "@/components/FormElements/HFTextFieldWithMask";
import InventoryBarCode from "@/components/FormElements/InventoryBarcode";
import NewCHFFormulaField from "@/components/FormElements/NewCHFormulaField";
import CellElementGenerator from "./CellElementGenerator";
import MultiLineCellFormElement from "./MultiLineCellFormElement";
import PolygonFieldTable from "./PolygonFieldTable";
import {
  HFDateDatePickerWithoutTimeZoneTable,
  HFDatePicker,
  HFDateTimePicker,
  HFTimePicker,
} from "@/views/table-redesign/hf-date";
import HFSwitch from "@/views/table-redesign/hf-switch";
import { HFVideoUpload } from "@/views/table-redesign/hf-video-upload";
import HFDatePickerNew from "@/views/table-redesign/DatePickerNew";

export const getFieldByType = ({
  isDisabled,
  control,
  updateObject,
  isBlackBg,
  computedSlug,
  field,
  defaultValue,
  row,
  newUi,
  index,
  setFormValue,
  newColumn,
  data,
  isTableView = false,
  fields,
  isWrapField,
  debouncedUpdateObject,
}) => {

  const fieldsMap = {
    SINGLE_LINE: (
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
        inputHeight={20}
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
    ),
    LINK: (
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
    ),
    TEXT: <HFTextComponent isTableView={true} field={field} />,
    BUTTON: <HFButtonField field={field} row={row} isTableView={true} />,
    STATUS: (
      <HFStatusField
        field={field}
        row={row}
        isTableView={true}
        control={control}
        name={computedSlug}
        updateObject={updateObject}
        newUi={newUi}
        disabled={isDisabled}
        index={index}
      />
    ),
    PASSWORD: (
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
    ),
    SCAN_BARCODE: (
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
    ),
    PHONE: (
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
    ),
    PHOTO: (
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
    ),
    MULTI_IMAGE: (
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
    ),
    MULTI_FILE: (
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
    ),
    FORMULA: (
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
    ),
    FORMULA_FRONTEND: (
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
    ),
    PICK_LIST: (
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
    ),
    INTERNATION_PHONE: (
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
    ),
    MULTISELECT: (
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
    ),
    DATE: newUi ? (
      <HFDatePickerNew
        field={field}
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
    ) : (
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
    ),
    DATE_TIME: newUi ? (
      <HFDatePickerNew
        withTime={true}
        dateTime={true}
        field={field}
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
    ) : (
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
    ),
    DATE_TIME_WITHOUT_TIME_ZONE: newUi ? (
      <HFDatePickerNew
        withTime={true}
        dateTime={true}
        timezone={true}
        field={field}
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
    ) : (
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
    ),
    TIME: (
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
    ),
    NUMBER: (
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
    ),
    FLOAT: (
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
    ),
    CHECKBOX: (
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
    ),
    SWITCH: (
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
    ),
    EMAIL: (
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
    ),
    ICON: (
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
    ),
    MAP: (
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
    ),
    QR: (
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
    ),
    POLYGON: (
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
    ),
    MULTI_LINE: (
      <MultiLineCellFormElement
        control={control}
        isWrapField={isWrapField}
        updateObject={debouncedUpdateObject}
        isNewTableView={true}
        computedSlug={computedSlug}
        field={field}
        isDisabled={isDisabled}
      />
    ),
    CUSTOM_IMAGE: (
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
    ),
    VIDEO: (
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
    ),
    FILE: (
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
    ),
    COLOR: (
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
    ),
    default: (
      <div style={{ padding: "0 4px" }}>
        <CellElementGenerator field={field} row={row} />
      </div>
    ),
  };

  return fieldsMap[field.type] || fieldsMap.default;
};
