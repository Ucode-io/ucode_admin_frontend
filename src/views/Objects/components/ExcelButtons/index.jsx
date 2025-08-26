import ExcelDownloadButton from "./ExcelDownloadButton";
import ExcelUploadButton from "./ExcelUploadButton";
import style from "./style.module.scss";

const ExcelButtons = ({
  fieldsMap,
  view,
  computedVisibleFields,
  searchText,
  checkedColumns,
  tableSlug,
}) => {
  return (
    <>
      <ExcelUploadButton fieldsMap={fieldsMap} tableSlug={tableSlug} />

      <ExcelDownloadButton
        computedVisibleFields={computedVisibleFields}
        view={view}
        searchText={searchText}
        checkedColumns={checkedColumns}
      />
    </>
  );
};

export default ExcelButtons;
