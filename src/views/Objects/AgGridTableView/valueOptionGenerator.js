import {format} from "date-fns";

const getColumnEditorParams = (item, columnDef) => {
  if (item?.type === "MULTISELECT" && item?.attributes?.options) {
    columnDef.cellEditor = "agSelectCellEditor";
    columnDef.cellEditorParams = {
      values: item.attributes.options.map((option) => option.label),
    };
  } else if (item?.type === "NUMBER") {
    columnDef.valueFormatter = (params) => {
      return params?.value?.toLocaleString();
    };
  } else if (item?.type === "INTERNATION_PHONE") {
    columnDef.valueFormatter = (params) => {
      return "+" + Number(params?.value).toLocaleString();
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
    columnDef.valueFormatter = (params) => {
      return "+" + Number(params?.value).toLocaleString();
    };
  }

  return {};
};
export default getColumnEditorParams;
