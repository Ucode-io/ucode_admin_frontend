import ExportBlock from "./ExportBlock";
import PageSizeBlock from "./PageSizeBlock";
import styles from "./style.module.scss";

const DocSettingsBlock = ({selectedSettingsTab, exportToHtml, pdfLoader, selectedPaperSizeIndex, setSelectedPaperSizeIndex}) => {
  return ( <div className={styles.docSettingsBlock} >
    {selectedSettingsTab === 0 && <PageSizeBlock selectedPaperSizeIndex={selectedPaperSizeIndex} setSelectedPaperSizeIndex={setSelectedPaperSizeIndex} />}
    {selectedSettingsTab === 1 && <ExportBlock exportToHtml={exportToHtml} pdfLoader={pdfLoader} />}
  </div> );
}
 
export default DocSettingsBlock;