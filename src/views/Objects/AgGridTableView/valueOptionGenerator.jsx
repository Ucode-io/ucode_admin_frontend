import React, {lazy} from "react";

const HFTextInputField = lazy(() => import("./HFTextInputField"));

const fieldTypeMap = {
  SINGLE_LINE: HFTextInputField,
  NUMBER: lazy(() => import("./FieldRelationGenerator/HFNumberFieldCell")),
  FLOAT: lazy(() => import("./FieldRelationGenerator/HFFloatFieldCell")),
  TEXT: lazy(() => import("./FieldRelationGenerator/HFTextComponent")),
  LINK: lazy(() => import("./FieldRelationGenerator/HFLinkFieldEditor")),
  STATUS: lazy(() => import("./FieldRelationGenerator/HFStatusFieldEditor")),
  MULTI_LINE: lazy(
    () => import("./FieldRelationGenerator/MultiLineCellEditor")
  ),
  PASSWORD: lazy(() => import("./FieldRelationGenerator/PasswordCellEditor")),
  CHECKBOX: lazy(() => import("./FieldRelationGenerator/HFCheckboxCell")),
  SWITCH: lazy(() => import("./FieldRelationGenerator/HFSwitchCellEditor")),
  FORMULA: lazy(() => import("./FieldRelationGenerator/FormulaCellEditor")),
  FORMULA_FRONTEND: lazy(
    () => import("./FieldRelationGenerator/FrontendFormulaCellEditor")
  ),
  INTERNATION_PHONE: lazy(
    () => import("./FieldRelationGenerator/PhoneCellEditor")
  ),
  PHONE: lazy(() => import("./FieldRelationGenerator/PhoneCellEditor")),
  DATE: lazy(() =>
    import("./FieldRelationGenerator/hf-date-pickers").then((m) => ({
      default: m.HFDatePicker,
    }))
  ),
  DATE_TIME: lazy(() =>
    import("./FieldRelationGenerator/hf-date-pickers").then((m) => ({
      default: m.HFDateTimePicker,
    }))
  ),
  DATE_TIME_WITHOUT_TIME_ZONE: lazy(() =>
    import("./FieldRelationGenerator/hf-date-pickers").then((m) => ({
      default: m.HFDateDatePickerWithoutTimeZoneTable,
    }))
  ),
  TIME: lazy(() =>
    import("./FieldRelationGenerator/hf-date-pickers").then((m) => ({
      default: m.HFTimePicker,
    }))
  ),
  LOOKUP: lazy(() => import("./FieldRelationGenerator/LookupCellEditor")),
  MULTISELECT: lazy(
    () => import("./FieldRelationGenerator/HFAggridMultiselect")
  ),
  PHOTO: lazy(() => import("./FieldRelationGenerator/HFPhotoUploadCellEditor")),
  MULTI_IMAGE: lazy(
    () => import("./FieldRelationGenerator/HFMultiImageCellEditor")
  ),
  FILE: lazy(() => import("./FieldRelationGenerator/HFFileUploadCellEditor")),
  VIDEO: lazy(() => import("./FieldRelationGenerator/HFVideoUploadCellEditor")),
  MAP: lazy(() => import("./FieldRelationGenerator/HFModalMapCellEditor")),
  POLYGON: lazy(
    () => import("./FieldRelationGenerator/PolygonFieldTableCellEditor")
  ),
  COLOR: lazy(() => import("./FieldRelationGenerator/ColorPickerCell")),
  ICON: lazy(() => import("./FieldRelationGenerator/IconPickerCell")),
};

const getColumnEditorParams = (item, columnDef) => {
  const type = item?.type;
  const Renderer = fieldTypeMap[type] || HFTextInputField;

  columnDef.cellRenderer = (props) => (
    <React.Suspense
      fallback={<div style={{minHeight: 40}}>Loading field…</div>}>
      <Renderer {...props} />
    </React.Suspense>
  );

  columnDef.cellRendererParams = {field: item};
  columnDef.pureComponent = true;

  switch (type) {
    case "SINGLE_LINE":
      columnDef.cellEditorParams = {maxLength: 255, field: item};
      columnDef.valueFormatter = (params) => params.value || "";
      break;

    case "PHONE":
    case "INTERNATION_PHONE":
      columnDef.valueFormatter = (params) =>
        params?.value ? "+" + Number(params?.value).toLocaleString() : "";
      break;

    default:
      break;
  }
};

export default getColumnEditorParams;
