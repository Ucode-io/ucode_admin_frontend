import ExcelDownloadButton from "./ExcelDownloadButton";
import ExcelUploadButton from "./ExcelUploadButton";
import style from "./style.module.scss";

const ExcelButtons = ({ fieldsMap, view }) => {
  return (
    <>
      <ExcelUploadButton fieldsMap={fieldsMap} />

      <ExcelDownloadButton view={view} />
    </>
  );
};

export default ExcelButtons;
