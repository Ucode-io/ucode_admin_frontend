import ExcelDownloadButton from "./ExcelDownloadButton";
import ExcelUploadButton from "./ExcelUploadButton";

const ExcelButtons = ({ fieldsMap }) => {
  return ( <>
    <ExcelUploadButton fieldsMap={fieldsMap} />
    <ExcelDownloadButton />
  </>);
}
 
export default ExcelButtons;