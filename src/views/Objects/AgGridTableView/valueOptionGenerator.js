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
      return new Date(params.value).toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };
  }

  return {};
};
export default getColumnEditorParams;
