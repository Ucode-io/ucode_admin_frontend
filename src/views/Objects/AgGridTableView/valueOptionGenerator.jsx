import {format} from "date-fns";
import {getRelationFieldTabsLabel} from "../../../utils/getRelationFieldLabel";
import LookupCellEditor from "./FieldRelationGenerator/LookupCellEditor";

const getColumnEditorParams = (item, columnDef) => {
  if (item?.type === "MULTISELECT" && item?.attributes?.options) {
    columnDef.cellEditor = "agSelectCellEditor";
    columnDef.cellEditorParams = {
      values: item?.attributes?.options.map((option) => option?.label),
    };
  } else if (item?.type === "NUMBER") {
    columnDef.valueFormatter = (params) => {
      return params?.value?.toLocaleString();
    };
  } else if (item?.type === "PASSWORD") {
    columnDef.cellEditorParams = {
      inputType: "password",
    };
  } else if (item?.type === "NUMBER") {
    columnDef.valueFormatter = (params) => {
      return params?.value?.toLocaleString();
    };
  } else if (item?.type === "INTERNATION_PHONE") {
    columnDef.valueFormatter = (params) => {
      if (Boolean(params?.value)) {
        return "+" + Number(params?.value).toLocaleString();
      } else return "";
    };
  } else if (item?.type === "DATE") {
    columnDef.valueFormatter = (params) => {
      return params?.value && format(new Date(params?.value), "dd-mm-yyyy");
    };

    columnDef.cellEditor = "agDateCellEditor";
    columnDef.cellEditorParams = {
      format: "dd-MM-yyyy",
    };
  } else if (item?.type === "LOOKUP") {
    // columnDef.cellRenderer = LookupCellEditor;
    columnDef.cellEditor = "agRichSelectCellEditor";

    columnDef.cellEditorParams = {
      values: ["AliceBlue", "AntiqueWhite", "Aqua"],
      allowTyping: true,
    };

    columnDef.valueFormatter = (params) => {
      const slugData = params?.data?.[`${item?.slug}_data`];
      if (!slugData) return "";
      return getRelationFieldTabsLabel(item, slugData);
    };

    columnDef.filterValueGetter = (params) => {
      const slugData = params?.data?.[`${item?.slug}_data`];
      if (!slugData) return "";
      return getRelationFieldTabsLabel(item, slugData);
    };
  }

  return {};
};
export default getColumnEditorParams;
