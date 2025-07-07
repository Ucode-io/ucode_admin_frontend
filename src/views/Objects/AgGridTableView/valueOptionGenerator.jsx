import {getRelationFieldTabsLabel} from "../../../utils/getRelationFieldLabel";
import ColorPicker from "./FieldRelationGenerator/ColorPickerCell";
import FormulaCellEditor from "./FieldRelationGenerator/FormulaCellEditor";
import FrontendFormulaCellEditor from "./FieldRelationGenerator/FrontendFormulaCellEditor";
import HFAggridMultiselect from "./FieldRelationGenerator/HFAggridMultiselect";
import HFCheckboxCell from "./FieldRelationGenerator/HFCheckboxCell";
import HFFileUploadCellEditor from "./FieldRelationGenerator/HFFileUploadCellEditor";
import HFFloatFieldCell from "./FieldRelationGenerator/HFFloatFieldCell";
import HFLinkFieldEditor from "./FieldRelationGenerator/HFLinkFieldEditor";
import HFModalMapCellEditor from "./FieldRelationGenerator/HFModalMapCellEditor";
import HFMultiImageCellEditor from "./FieldRelationGenerator/HFMultiImageCellEditor";
import HFNumberFieldCell from "./FieldRelationGenerator/HFNumberFieldCell";
import HFPhotoUploadCellEditor from "./FieldRelationGenerator/HFPhotoUploadCellEditor";
import HFStatusFieldEditor from "./FieldRelationGenerator/HFStatusFieldEditor";
import HFSwitchCellEditor from "./FieldRelationGenerator/HFSwitchCellEditor";
import HFTextComponent from "./FieldRelationGenerator/HFTextComponent";
import HFVideoUploadCellEditor from "./FieldRelationGenerator/HFVideoUploadCellEditor";
import IconPickerCell from "./FieldRelationGenerator/IconPickerCell";
import LookupCellEditor from "./FieldRelationGenerator/LookupCellEditor";
import MultiLineCellEditor from "./FieldRelationGenerator/MultiLineCellEditor";
import PasswordCellEditor from "./FieldRelationGenerator/PasswordCellEditor";
import PhoneCellEditor from "./FieldRelationGenerator/PhoneCellEditor";
import PolygonFieldTableCellEditor from "./FieldRelationGenerator/PolygonFieldTableCellEditor";
import {
  HFDateDatePickerWithoutTimeZoneTable,
  HFDatePicker,
  HFDateTimePicker,
  HFTimePicker,
} from "./FieldRelationGenerator/hf-date-pickers";
import HFTextInputField from "./HFTextInputField";

const fieldTypeMap = {
  SINGLE_LINE: HFTextInputField,
  NUMBER: HFNumberFieldCell,
  FLOAT: HFFloatFieldCell,
  TEXT: HFTextComponent,
  LINK: HFLinkFieldEditor,
  STATUS: HFStatusFieldEditor,
  MULTI_LINE: MultiLineCellEditor,
  PASSWORD: PasswordCellEditor,
  CHECKBOX: HFCheckboxCell,
  SWITCH: HFSwitchCellEditor,
  FORMULA: FormulaCellEditor,
  FORMULA_FRONTEND: FrontendFormulaCellEditor,
  INTERNATION_PHONE: PhoneCellEditor,
  PHONE: PhoneCellEditor,
  DATE: HFDatePicker,
  DATE_TIME: HFDateTimePicker,
  DATE_TIME_WITHOUT_TIME_ZONE: HFDateDatePickerWithoutTimeZoneTable,
  TIME: HFTimePicker,
  LOOKUP: LookupCellEditor,
  MULTISELECT: HFAggridMultiselect,
  PHOTO: HFPhotoUploadCellEditor,
  MULTI_IMAGE: HFMultiImageCellEditor,
  FILE: HFFileUploadCellEditor,
  VIDEO: HFVideoUploadCellEditor,
  MAP: HFModalMapCellEditor,
  POLYGON: PolygonFieldTableCellEditor,
  COLOR: ColorPicker,
  ICON: IconPickerCell,
};

const getColumnEditorParams = (item, columnDef) => {
  const type = item?.type;
  const Renderer = fieldTypeMap[type] || HFTextInputField;

  columnDef.cellRenderer = Renderer;
  columnDef.cellRendererParams = {field: item};
  columnDef.pureComponent = true;

  switch (type) {
    case "SINGLE_LINE":
      columnDef.cellEditorParams = {maxLength: 255, field: item};
      columnDef.valueFormatter = (params) => params.value || "";
      break;

    // case "MULTISELECT":
    //   columnDef.valueGetter = (params) =>
    //     params?.data?.[params.colDef.field] || [];
    //   columnDef.cellEditorParams = {
    //     values: item?.attributes?.options?.map((o) => o?.label),
    //     field: item,
    //   };
    //   break;

    // case "LOOKUP":
    //   columnDef.filterValueGetter = (params) => {
    //     const slugData = params?.data?.[`${item?.slug}_data`];
    //     return slugData ? getRelationFieldTabsLabel(item, slugData) : "";
    //   };
    //   break;

    // case "FORMULA_FRONTEND":
    //   columnDef.valueGetter = (params) => {
    //     const formula = item?.attributes?.formula;
    //     if (!formula) return 0;

    //     let computedFormula = formula;
    //     const matches = computedFormula.match(/[a-zA-Z0-9_]+/g);

    //     if (matches) {
    //       matches.forEach((slug) => {
    //         const value = params?.data?.[slug] ?? 0;
    //         computedFormula = computedFormula.replace(
    //           new RegExp(`\\b${slug}\\b`, "g"),
    //           value
    //         );
    //       });
    //     }

    //     try {
    //       return eval(computedFormula);
    //     } catch (error) {
    //       console.error("Error evaluating formula:", error);
    //       return "ERROR";
    //     }
    //   };
    //   columnDef.cellRendererParams = {
    //     field: item,
    //     formula: item?.attributes?.formula,
    //   };
    //   break;

    case "PHONE":
    case "INTERNATION_PHONE":
      columnDef.valueFormatter = (params) => {
        return params?.value
          ? "+" + Number(params?.value).toLocaleString()
          : "";
      };
      break;

    default:
      break;
  }
};

export default getColumnEditorParams;
