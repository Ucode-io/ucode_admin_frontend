import HFAutocomplete from "@/components/FormElements/HFAutocomplete";
import HFCheckbox from "@/components/FormElements/HFCheckbox";
import HFColorPicker from "@/components/FormElements/HFColorPicker";
import HFDatePicker from "@/components/FormElements/HFDatePicker";
import HFDateTimePicker from "@/components/FormElements/HFDateTimePicker";
import HFFileUpload from "@/components/FormElements/HFFileUpload";
import HFFloatField from "@/components/FormElements/HFFloatField";
import HFFormulaField from "@/components/FormElements/HFFormulaField";
import HFIconPicker from "@/components/FormElements/HFIconPicker";
import HFModalMap from "@/components/FormElements/HFModalMap";
import HFMultipleAutocomplete from "@/components/FormElements/HFMultipleAutocomplete";
import HFNumberField from "@/components/FormElements/HFNumberField";
import HFPassword from "@/components/FormElements/HFPassword";
import HFSwitch from "@/components/FormElements/HFSwitch";
import HFTextField from "@/components/FormElements/HFTextField";
import HFTextFieldWithMask from "@/components/FormElements/HFTextFieldWithMask";
import HFTimePicker from "@/components/FormElements/HFTimePicker";
import HFVideoUpload from "@/components/FormElements/HFVideoUpload";
import InventoryBarCode from "@/components/FormElements/InventoryBarcode";
import NewCHFFormulaField from "@/components/FormElements/NewCHFormulaField";
import CellManyToManyRelationElement from "./CellManyToManyRelationElement";
import CellRelationFormElementForTableView from "./CellRelationFormElementForTable";
import MultiLineCellFormElement from "./MultiLineCellFormElement";

export const fieldTypesComponent = {
  LOOKUP: CellRelationFormElementForTableView,
  LOOKUPS: CellManyToManyRelationElement,
  SINGLE_LINE: HFTextField,
  PASSWORD: HFPassword,
  SCAN_BARCODE: InventoryBarCode,
  PHONE: HFTextFieldWithMask,
  FORMULA: HFFormulaField,
  FORMULA_FRONTEND: NewCHFFormulaField,
  PICK_LIST: HFAutocomplete,
  MULTISELECT: HFMultipleAutocomplete,
  MULTISELECT_V2: HFMultipleAutocomplete,
  DATE: HFDatePicker,
  DATE_TIME: HFDateTimePicker,
  TIME: HFTimePicker,
  NUMBER: HFNumberField,
  FLOAT: HFFloatField,
  CHECKBOX: HFCheckbox,
  SWITCH: HFSwitch,
  EMAIL: HFTextField,
  ICON: HFIconPicker,
  MAP: HFModalMap,
  MULTI_LINE: MultiLineCellFormElement,
  CUSTOM_IMAGE: HFFileUpload,
  VIDEO: HFVideoUpload,
  FILE: HFFileUpload,
  COLOR: HFColorPicker,
};
