import {getRelationFieldTabsLabel} from "../../../utils/getRelationFieldLabel";
import LookupCellEditor from "./FieldRelationGenerator/LookupCellEditor";
import MultiLineCellEditor from "./FieldRelationGenerator/MultiLineCellEditor";
import PhoneCellEditor from "./FieldRelationGenerator/PhoneCellEditor";
import PasswordCellEditor from "./FieldRelationGenerator/PasswordCellEditor";
import FrontendFormulaCellEditor from "./FieldRelationGenerator/FrontendFormulaCellEditor";
import FormulaCellEditor from "./FieldRelationGenerator/FormulaCellEditor";
import DateCellEditor from "./FieldRelationGenerator/DateCellEditor";
import DateTimeCellEditor from "./FieldRelationGenerator/DateTimeCellEditor";
import HFDateTimePickerWithoutCell from "./FieldRelationGenerator/HFDateTimePickerWithoutCell";
import HFTimePickerCellEditor from "./FieldRelationGenerator/HFTimePickerCellEditor";
import HFSwitchCellEditor from "./FieldRelationGenerator/HFSwitchCellEditor";
import HFPhotoUploadCellEditor from "./FieldRelationGenerator/HFPhotoUploadCellEditor";
import HFMultiImageCellEditor from "./FieldRelationGenerator/HFMultiImageCellEditor";
import HFFileUploadCellEditor from "./FieldRelationGenerator/HFFileUploadCellEditor";
import HFVideoUploadCellEditor from "./FieldRelationGenerator/HFVideoUploadCellEditor";
import HFModalMapCellEditor from "./FieldRelationGenerator/HFModalMapCellEditor";
import PolygonFieldTableCellEditor from "./FieldRelationGenerator/PolygonFieldTableCellEditor";
import HFQrFieldComponentCellEditor from "./FieldRelationGenerator/HFQrFieldComponentCellEditor";

const getColumnEditorParams = (item, columnDef) => {
  switch (item?.type) {
    case "NUMBER":
      columnDef.valueFormatter = (params) => {
        return params?.value?.toLocaleString();
      };
      console.log("columnDef===>", columnDef);
      if (columnDef?.pinned) {
        console.log("columnDef", columnDef);
      }

      break;

    case "MULTI_LINE":
      (columnDef.cellRenderer = MultiLineCellEditor),
        (columnDef.cellEditorParams = {
          maxLength: 50,
        });

      break;

    case "PASSWORD":
      columnDef.cellRenderer = PasswordCellEditor;

      break;

    case "NUMBER":
      columnDef.valueFormatter = (params) => {
        return params?.value?.toLocaleString();
      };

      break;

    case "CHECKBOX":
      columnDef.cellRenderer = "agCheckboxCellRenderer";
      break;

    case "SWITCH":
      columnDef.cellRenderer = HFSwitchCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };

      break;

    case "FORMULA_FRONTEND":
      columnDef.cellRenderer = FrontendFormulaCellEditor;
      break;

    case "FORMULA":
      columnDef.cellRenderer = FormulaCellEditor;
      break;

    case "INTERNATION_PHONE":
      (columnDef.cellRenderer = PhoneCellEditor),
        (columnDef.valueFormatter = (params) => {
          if (Boolean(params?.value)) {
            return "+" + Number(params?.value).toLocaleString();
          } else return "";
        });

      break;

    // DATE FIELDS:
    case "DATE":
      columnDef.cellRenderer = DateCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };

      break;

    case "DATE_TIME":
      columnDef.cellRenderer = DateTimeCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };

      break;

    case "DATE_TIME_WITHOUT_TIME_ZONE":
      columnDef.cellRenderer = HFDateTimePickerWithoutCell;
      columnDef.cellRendererParams = {
        field: item,
      };

      break;

    case "TIME":
      columnDef.cellRenderer = HFTimePickerCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };

      break;

    // WITH OPTIONS RELATION & MULTISELECT:
    case "LOOKUP":
      columnDef.cellEditor = "agRichSelectCellEditor";
      columnDef.cellRenderer = LookupCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };

      columnDef.filterValueGetter = (params) => {
        const slugData = params?.data?.[`${item?.slug}_data`];
        if (!slugData) return "";
        return getRelationFieldTabsLabel(item, slugData);
      };

      break;

    case "MULTISELECT":
      columnDef.cellEditor = "agSelectCellEditor";
      columnDef.cellEditorParams = {
        values: item?.attributes?.options.map((option) => option?.label),
      };
      break;

    // FILE & PHOTO FIELDS
    case "PHOTO":
      columnDef.cellRenderer = HFPhotoUploadCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };
      break;

    case "MULTI_IMAGE":
      columnDef.cellRenderer = HFMultiImageCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };
      break;

    case "FILE":
      columnDef.cellRenderer = HFFileUploadCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };
      break;

    case "VIDEO":
      columnDef.cellRenderer = HFVideoUploadCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };
      break;

    case "MAP":
      columnDef.cellRenderer = HFModalMapCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };
      break;

    case "POLYGON":
      columnDef.cellRenderer = PolygonFieldTableCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };
      break;

    case "QR":
      columnDef.cellRenderer = HFQrFieldComponentCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };
      break;

    default:
      return {};
  }
};
export default getColumnEditorParams;
