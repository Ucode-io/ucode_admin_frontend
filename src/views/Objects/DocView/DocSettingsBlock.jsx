import ExportBlock from "./ExportBlock";
import PageSizeBlock from "./PageSizeBlock";
import styles from "./style.module.scss";

const DocSettingsBlock = ({selectedSettingsTab, exportToHtml, pdfLoader}) => {
  return ( <div className={styles.docSettingsBlock} >
    {selectedSettingsTab === 0 && <PageSizeBlock />}
    {selectedSettingsTab === 1 && <ExportBlock exportToHtml={exportToHtml} pdfLoader={pdfLoader} />}
  </div> );
}
 
export default DocSettingsBlock;