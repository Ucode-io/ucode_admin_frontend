import ExcelDownloadButton from "./ExcelDownloadButton";
import ExcelUploadButton from "./ExcelUploadButton";
import style from "./style.module.scss";

const ExcelButtons = ({fieldsMap, view, computedVisibleFields}) => {
  return (
    <>
      <ExcelUploadButton fieldsMap={fieldsMap} />

      <ExcelDownloadButton
        computedVisibleFields={computedVisibleFields}
        view={view}
      />
    </>
  );
};

export default ExcelButtons;
