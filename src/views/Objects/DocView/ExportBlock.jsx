import { CircularProgress } from "@mui/material"
import { useTranslation } from "react-i18next"
import styles from "./style.module.scss"

const ExportBlock = ({ pdfLoader, exportToPDF, htmlLoader, exportToHTML }) => {
  const { t } = useTranslation()
  return (
    <div className={styles.docListBlock}>
      <div className={styles.doclistHeader}>
        <div className={styles.doclistHeaderTitle}>{t("export")}</div>
      </div>

      <div className={styles.docList}>
        <div className={styles.pageSizeRow} onClick={exportToPDF}>
          <div className={styles.documentIcon}>PDF</div> {t("export.to.pdf")}
          {pdfLoader && <CircularProgress size={14} />}
        </div>
        <div className={styles.pageSizeRow} onClick={exportToHTML}>
          <div className={styles.documentIcon}>{t("variable")}</div>{" "}
          {t("set.variables")}
          {htmlLoader && <CircularProgress size={14} />}
        </div>
      </div>
    </div>
  )
}

export default ExportBlock
