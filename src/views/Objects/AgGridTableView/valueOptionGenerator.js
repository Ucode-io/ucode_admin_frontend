const getColumnEditorParams = (item, columnDef) => {
  if (item?.type === "MULTISELECT" && item?.attributes?.options) {
    columnDef.cellEditor = "agSelectCellEditor";
    columnDef.cellEditorParams = {
      values: item.attributes.options.map((option) => option.label),
    };
  }

  return {};
};
export default getColumnEditorParams;
