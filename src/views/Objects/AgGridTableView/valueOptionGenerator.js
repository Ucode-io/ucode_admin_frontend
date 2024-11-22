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
  } else if (item?.type === "DATE") {
    columnDef.valueFormatter = (params) => {
      return format(new Date(params.value), "dd-mm-yyyy");
    };

    columnDef.cellEditor = "agDateCellEditor";
    columnDef.cellEditorParams = {
      format: "dd-MM-yyyy",
    };
  }

  return {};
};
export default getColumnEditorParams;
