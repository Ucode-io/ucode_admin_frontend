import {format} from "date-fns";
import {getRelationFieldTabsLabel} from "../../../utils/getRelationFieldLabel";
import LookupCellEditor from "./FieldRelationGenerator/LookupCellEditor";
import MultiLineCellEditor from "./FieldRelationGenerator/MultiLineCellEditor";
import PhoneCellEditor from "./FieldRelationGenerator/PhoneCellEditor";
import PasswordCellEditor from "./FieldRelationGenerator/PasswordCellEditor";

const getColumnEditorParams = (item, columnDef) => {
  switch (item?.type) {
    case "MULTISELECT":
      columnDef.cellEditor = "agSelectCellEditor";
      columnDef.cellEditorParams = {
        values: item?.attributes?.options.map((option) => option?.label),
      };
      break;

    case "NUMBER":
      columnDef.valueFormatter = (params) => {
        return params?.value?.toLocaleString();
      };

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

    case "INTERNATION_PHONE":
      (columnDef.cellRenderer = PhoneCellEditor),
        (columnDef.valueFormatter = (params) => {
          if (Boolean(params?.value)) {
            return "+" + Number(params?.value).toLocaleString();
          } else return "";
        });

      break;

    case "DATE":
      columnDef.valueFormatter = (params) => {
        return params?.value && format(new Date(params?.value), "dd-mm-yyyy");
      };

      columnDef.cellEditor = "agDateCellEditor";
      columnDef.cellEditorParams = {
        format: "dd-MM-yyyy",
      };

      break;

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

      // columnDef.cellEditorParams = {
      //   values: ["AliceBlue", "AntiqueWhite", "Aqua"],
      //   allowTyping: true,
      // };

      // columnDef.valueFormatter = (params) => {
      //   const slugData = params?.data?.[`${item?.slug}_data`];
      //   if (!slugData) return "";
      //   return getRelationFieldTabsLabel(item, slugData);
      // };

      break;

    default:
      return {};
  }
};
export default getColumnEditorParams;
