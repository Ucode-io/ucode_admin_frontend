import HFCheckbox from "@/views/table-redesign/hf-checkbox-optimization";
// import HFAutocomplete from "@/components/FormElementsOptimization/HFAutocomplete";
import HFButtonField from "@/components/FormElementsOptimization/HFButtonField";
import HFColorPicker from "@/components/FormElementsOptimization/HFColorPicker";
import HFFileUpload from "@/components/FormElementsOptimization/HFFileUpload";
import HFFloatField from "@/components/FormElementsOptimization/HFFloatField";
import HFFormulaField from "@/components/FormElementsOptimization/HFFormulaField";
import HFIconPicker from "@/components/FormElementsOptimization/HFIconPicker";
import HFInternationPhone from "@/components/FormElementsOptimization/HFInternationPhone";
import HFLinkField from "@/components/FormElementsOptimization/HFLinkField";
import HFModalMap from "@/components/FormElementsOptimization/HFModalMap";
import HFMultiFile from "@/components/FormElementsOptimization/HFMultiFile";
import HFMultiImage from "@/components/FormElementsOptimization/HFMultiImage";
import HFMultipleAutocomplete from "@/components/FormElementsOptimization/HFMultipleAutocomplete";
import HFNumberField from "@/components/FormElementsOptimization/HFNumberField";
import HFPassword from "@/components/FormElementsOptimization/HFPassword";
import HFPhotoUpload from "@/components/FormElementsOptimization/HFPhotoUpload";
import HFQrFieldComponent from "@/components/FormElementsOptimization/HFQrFieldOptimization";
import HFStatusField from "@/components/FormElementsOptimization/HFStatusField";
import HFTextComponent from "@/components/FormElementsOptimization/HFTextComponent";
import HFTextField from "@/components/FormElementsOptimization/HFTextField";
import HFTextFieldWithMask from "@/components/FormElementsOptimization/HFTextFieldWithMask";
import InventoryBarCode from "@/components/FormElementsOptimization/InventoryBarcode";
import NewCHFFormulaField from "@/components/FormElementsOptimization/NewCHFormulaField";
import CellElementGenerator from "./CellElementGenerator";
import MultiLineCellFormElement from "./MultiLineCellFormElement";
import PolygonFieldTable from "./PolygonFieldTableOptimization";
import {
  HFDateDatePickerWithoutTimeZoneTable,
  HFDatePicker,
  HFDateTimePicker,
  HFTimePickerNew,
} from "@/views/table-redesign/hf-date";
import HFSwitch from "@/views/table-redesign/hf-switch-optimization";
import { HFVideoUpload } from "@/views/table-redesign/hf-video-upload-optimization";
import HFDatePickerNew from "@/views/table-redesign/DatePickerOptimization";

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
  newColumn,
  isTableView = false,
  fields,
  isWrapField,
  handleChange,
}) => {
  const fieldsMap = {
    SINGLE_LINE: (
      <HFTextField
        disabled={isDisabled}
        isFormEdit
        isNewTableView={true}
        isBlackBg={isBlackBg}
        name={computedSlug}
        fullWidth
        field={field}
        inputHeight={20}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        row={row}
        handleChange={handleChange}
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
        disabled={isDisabled}
        isNewTableView={true}
        isBlackBg={isBlackBg}
        name={computedSlug}
        fullWidth
        field={field}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        row={row}
        handleChange={handleChange}
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
        handleChange={handleChange}
      />
    ),
    PASSWORD: (
      <HFPassword
        isNewTableView={true}
        isBlackBg={isBlackBg}
        name={computedSlug}
        field={field}
        isTransparent={true}
        newUi={newUi}
        row={row}
        handleChange={handleChange}
      />
    ),
    SCAN_BARCODE: (
      <InventoryBarCode
        name={computedSlug}
        fullWidth
        field={field}
        disabled={isDisabled}
        row={row}
      />
    ),
    PHONE: (
      <HFTextFieldWithMask
        disabled={isDisabled}
        isFormEdit
        isBlackBg={isBlackBg}
        name={computedSlug}
        fullWidth
        isTransparent={true}
        required={field.required}
        placeholder={field.attributes?.placeholder}
        mask={"(99) 999-99-99"}
        field={field}
        row={row}
        handleChange={handleChange}
      />
    ),
    PHOTO: (
      <HFPhotoUpload
        disabled={isDisabled}
        field={field}
        isNewTableView={true}
        name={computedSlug}
        handleChange={handleChange}
        row={row}
      />
    ),
    MULTI_IMAGE: (
      <HFMultiImage
        disabled={isDisabled}
        field={field}
        isTableView={true}
        updateObject={updateObject}
        name={computedSlug}
        newUi={newUi}
        handleChange={handleChange}
        row={row}
      />
    ),
    MULTI_FILE: (
      <HFMultiFile
        disabled={isDisabled}
        field={field}
        isTableView={true}
        updateObject={updateObject}
        name={computedSlug}
        newUi={newUi}
        handleChange={handleChange}
        row={row}
      />
    ),
    FORMULA: (
      <HFFormulaField
        disabled={isDisabled}
        isTableView={true}
        name={computedSlug}
        row={row}
      />
    ),
    FORMULA_FRONTEND: (
      <NewCHFFormulaField
        isTableView={true}
        name={computedSlug}
        fieldsList={fields}
        disabled={!isDisabled}
        isTransparent={true}
        field={field}
        newUi={newUi}
        row={row}
      />
    ),
    INTERNATION_PHONE: (
      <HFInternationPhone
        isTableView={isTableView}
        name={computedSlug}
        disabled={isDisabled}
        newUi={newUi}
        row={row}
        handleChange={handleChange}
        field={field}
      />
    ),
    MULTISELECT: (
      <HFMultipleAutocomplete
        disabled={isDisabled}
        isFormEdit
        isNewTableView={true}
        width="100%"
        required={field.required}
        field={field}
        placeholder={field.attributes?.placeholder}
        isBlackBg={isBlackBg}
        newUi={newUi}
        handleChange={handleChange}
        row={row}
      />
    ),
    DATE: newUi ? (
      <HFDatePickerNew
        field={field}
        placeholder={field.attributes?.placeholder}
        disabled={isDisabled}
        handleChange={handleChange}
        row={row}
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
        field={field}
        placeholder={field.attributes?.placeholder}
        disabled={isDisabled}
        handleChange={handleChange}
        row={row}
        withTime={true}
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
        field={field}
        placeholder={field.attributes?.placeholder}
        disabled={isDisabled}
        handleChange={handleChange}
        row={row}
        withTime={true}
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
      <HFTimePickerNew
        disabled={isDisabled}
        row={row}
        handleChange={handleChange}
        field={field}
      />
    ),
    NUMBER: (
      <HFNumberField
        disabled={isDisabled}
        isNewTableView={true}
        name={computedSlug}
        fullWidth
        isBlackBg={isBlackBg}
        isTransparent={true}
        newColumn={newColumn}
        newUi={newUi}
        row={row}
        field={field}
        handleChange={handleChange}
      />
    ),
    FLOAT: (
      <HFFloatField
        disabled={isDisabled}
        isFormEdit
        fullWidth
        isBlackBg={isBlackBg}
        isTransparent={true}
        row={row}
        field={field}
        handleChange={handleChange}
      />
    ),
    CHECKBOX: (
      <HFCheckbox
        field={field}
        disabled={isDisabled}
        isBlackBg={isBlackBg}
        handleChange={handleChange}
        row={row}
      />
    ),
    SWITCH: (
      <HFSwitch
        newColumn={newColumn}
        disabled={isDisabled}
        field={field}
        isBlackBg={isBlackBg}
        required={field.required}
        handleChange={handleChange}
        row={row}
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
        row={row}
        field={field}
      />
    ),
    ICON: (
      <HFIconPicker
        disabled={isDisabled}
        handleChange={handleChange}
        row={row}
        field={field}
      />
    ),
    MAP: (
      <HFModalMap
        isTransparent={true}
        field={field}
        defaultValue={defaultValue}
        handleChange={handleChange}
        row={row}
      />
    ),
    QR: (
      <HFQrFieldComponent
        disabled={isDisabled}
        isTableView={isTableView}
        field={field}
        required={field?.required}
        newColumn={newColumn}
        row={row}
      />
    ),
    POLYGON: (
      <PolygonFieldTable
        field={field}
        computedSlug={computedSlug}
        isDisabled={isDisabled}
        isNewTableView={true}
        row={row}
        handleChange={handleChange}
        disabled={isDisabled}
      />
    ),
    MULTI_LINE: (
      <MultiLineCellFormElement
        isWrapField={isWrapField}
        isNewTableView={true}
        field={field}
        isDisabled={isDisabled}
        row={row}
        handleChange={handleChange}
      />
    ),
    CUSTOM_IMAGE: (
      <HFFileUpload field={field} handleChange={handleChange} row={row} />
    ),
    VIDEO: (
      <HFVideoUpload row={row} field={field} handleChange={handleChange} />
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
        field={field}
        row={row}
        handleChange={handleChange}
        disabled={isDisabled}
      />
    ),
    default: (
      <div style={{ padding: "0 4px" }}>
        <CellElementGenerator
          field={field}
          row={row}
          handleChange={handleChange}
        />
      </div>
    ),
  };

  return fieldsMap[field.type] || fieldsMap.default;
};
