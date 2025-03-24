import HFTextInputField from "./HFTextInputField";
import HFTextComponent from "./FieldRelationGenerator/HFTextComponent";
import PhoneCellEditor from "./FieldRelationGenerator/PhoneCellEditor";
import LookupCellEditor from "./FieldRelationGenerator/LookupCellEditor";
import FormulaCellEditor from "./FieldRelationGenerator/FormulaCellEditor";
import HFNumberFieldCell from "./FieldRelationGenerator/HFNumberFieldCell";
import HFLinkFieldEditor from "./FieldRelationGenerator/HFLinkFieldEditor";
import HFMoneyFieldEditor from "./FieldRelationGenerator/HFMoneyFieldEditor";
import PasswordCellEditor from "./FieldRelationGenerator/PasswordCellEditor";
import HFSwitchCellEditor from "./FieldRelationGenerator/HFSwitchCellEditor";
import HFStatusFieldEditor from "./FieldRelationGenerator/HFStatusFieldEditor";
import MultiLineCellEditor from "./FieldRelationGenerator/MultiLineCellEditor";
import {getRelationFieldTabsLabel} from "../../../utils/getRelationFieldLabel";
import HFAggridMultiselect from "./FieldRelationGenerator/HFAggridMultiselect";
import HFModalMapCellEditor from "./FieldRelationGenerator/HFModalMapCellEditor";
import HFMultiImageCellEditor from "./FieldRelationGenerator/HFMultiImageCellEditor";
import HFFileUploadCellEditor from "./FieldRelationGenerator/HFFileUploadCellEditor";
import HFVideoUploadCellEditor from "./FieldRelationGenerator/HFVideoUploadCellEditor";
import HFPhotoUploadCellEditor from "./FieldRelationGenerator/HFPhotoUploadCellEditor";
import FrontendFormulaCellEditor from "./FieldRelationGenerator/FrontendFormulaCellEditor";
import PolygonFieldTableCellEditor from "./FieldRelationGenerator/PolygonFieldTableCellEditor";
import HFQrFieldComponentCellEditor from "./FieldRelationGenerator/HFQrFieldComponentCellEditor";
import {
  HFDateDatePickerWithoutTimeZoneTable,
  HFDatePicker,
  HFDateTimePicker,
  HFTimePicker,
} from "./FieldRelationGenerator/hf-date-pickers";
import HFCheckboxCell from "./FieldRelationGenerator/HFCheckboxCell";
import ColorPicker from "./FieldRelationGenerator/ColorPickerCell";
import IconPickerCell from "./FieldRelationGenerator/IconPickerCell";

const getColumnEditorParams = (item, columnDef) => {
  switch (item?.type) {
    case "SINGLE_LINE":
      columnDef.cellRenderer = HFTextInputField;
      columnDef.cellEditorParams = {
        maxLength: 255,
        field: item,
      };
      columnDef.valueFormatter = (params) => params.value || "";
      break;
    case "NUMBER":
      columnDef.cellRenderer = HFNumberFieldCell;

      break;

    case "TEXT":
      (columnDef.cellRenderer = HFTextComponent),
        (columnDef.cellRendererParams = {
          field: item,
        });

      break;

    case "LINK":
      (columnDef.cellRenderer = HFLinkFieldEditor),
        (columnDef.cellRendererParams = {
          field: item,
        });

      break;

    case "MONEY":
      (columnDef.cellRenderer = HFMoneyFieldEditor),
        (columnDef.cellRendererParams = {
          field: item,
        });

      columnDef.valueGetter = (params) => {
        return params?.data?.[params.colDef.field] || [];
      };

      break;

    case "STATUS":
      (columnDef.cellRenderer = HFStatusFieldEditor),
        (columnDef.cellRendererParams = {
          field: item,
        });

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

    case "CHECKBOX":
      columnDef.cellRenderer = HFCheckboxCell;
      break;

    case "SWITCH":
      columnDef.cellRenderer = HFSwitchCellEditor;
      columnDef.cellRendererParams = {
        field: item,
      };

      break;

    case "FORMULA_FRONTEND":
      columnDef.cellRenderer = FrontendFormulaCellEditor;
      columnDef.valueGetter = (params) => {
        const formula = item?.attributes?.formula;
        if (!formula) return 0;

        let computedFormula = formula;
        const matches = computedFormula.match(/[a-zA-Z0-9_]+/g);

        if (matches) {
          matches.forEach((slug) => {
            const value = params?.data?.[slug] ?? 0;
            computedFormula = computedFormula?.replace(
              new RegExp(`\\b${slug}\\b`, "g"),
              value
            );
          });
        }

        try {
          return eval(computedFormula);
        } catch (error) {
          console.error("Error evaluating formula:", error);
          return "ERROR";
        }
      };
      columnDef.cellRendererParams = {
        field: item,
        formula: item?.attributes?.formula,
      };
      break;

    case "FORMULA":
      columnDef.cellRenderer = FormulaCellEditor;
      columnDef.cellRendererParams = {
        field: item,
        formula: item?.attributes?.formula,
      };
      break;

    case "INTERNATION_PHONE":
    case "PHONE":
      (columnDef.cellRenderer = PhoneCellEditor),
        (columnDef.valueFormatter = (params) => {
          if (Boolean(params?.value)) {
            return "+" + Number(params?.value).toLocaleString();
          } else return "";
        });

      break;

    // DATE FIELDS:
    case "DATE":
      columnDef.cellRenderer = HFDatePicker;
      columnDef.cellRendererParams = {
        field: item,
      };

      break;

    case "DATE_TIME":
      columnDef.cellRenderer = HFDateTimePicker;
      columnDef.cellRendererParams = {
        field: item,
      };

      break;

    case "DATE_TIME_WITHOUT_TIME_ZONE":
      columnDef.cellRenderer = HFDateDatePickerWithoutTimeZoneTable;
      columnDef.cellRendererParams = {
        field: item,
      };

      break;

    case "TIME":
      columnDef.cellRenderer = HFTimePicker;
      columnDef.cellRendererParams = {
        field: item,
      };

      break;

    // WITH OPTIONS RELATION & MULTISELECT:
    case "LOOKUP":
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
      columnDef.cellRenderer = HFAggridMultiselect;
      columnDef.cellEditorParams = {
        values: item?.attributes?.options.map((option) => option?.label),
        field: item,
      };

      columnDef.valueGetter = (params) => {
        return params?.data?.[params.colDef.field] || [];
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

    case "COLOR":
      columnDef.cellRenderer = ColorPicker;
      columnDef.cellRendererParams = {
        field: item,
      };
      break;

    case "ICON":
      columnDef.cellRenderer = IconPickerCell;
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
      columnDef.cellRenderer = HFTextInputField;
      columnDef.cellEditorParams = {
        maxLength: 255,
        field: item,
      };
      columnDef.valueFormatter = (params) => params.value || "";
      break;
  }
};
export default getColumnEditorParams;
