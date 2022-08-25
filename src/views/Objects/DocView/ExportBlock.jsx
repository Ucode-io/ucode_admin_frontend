import { CircularProgress } from "@mui/material"
import documentTemplateService from "../../../services/documentTemplateService"
import styles from "./style.module.scss"

const ExportBlock = ({ selectedTemplate, pdfLoader, exportToHtml }) => {


  

  return (
    <div className={styles.docListBlock}>
      <div className={styles.doclistHeader}>
        <div className={styles.doclistHeaderTitle}>Экспорт</div>
      </div>

      <div className={styles.docList}>
        <div className={styles.pageSizeRow} onClick={exportToHtml} >
         <div className={styles.documentIcon} >PDF</div> Export to PDF {pdfLoader && <CircularProgress size={14} />}
        </div>
        <div className={styles.pageSizeRow}>
          <div className={styles.documentIcon} >HTML</div> Export to HTML
        </div>
      </div>
    </div>
  )
}

export default ExportBlock
