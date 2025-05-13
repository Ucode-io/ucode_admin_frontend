import { CircularProgress } from "@mui/material";
import styles from "./style.module.scss";
import LinkedListTables from "./DynamicObjectsTemplate/LinkedListTables";
import { useGetLang } from "../../../hooks/useGetLang";
import { generateLangaugeText } from "../../../utils/generateLanguageText";
import { useTranslation } from "react-i18next";

const ExportBlock = ({
  pdfLoader,
  exportToPDF,
  htmlLoader,
  exportToHTML,
  setSelectedOutputTable,
  selectedOutputTable,
  selectedOutputObject,
  setSelectedOutputObject,
  templates,
  selectedTemplate,
  selectedLinkedObject,
  setSelectedLinkedObject,
  setSelectedObject,
  selectedObject,
  setlLinkedObjectView,
}) => {
  const lang = useGetLang("Table");
  const { i18n } = useTranslation();

  return (
    <div className={styles.docListBlock}>
      <div className={styles.doclistHeader}>
        <div className={styles.doclistHeaderTitle}>
          {generateLangaugeText(lang, i18n?.language, "Export") || "Export"}
        </div>
      </div>

      <div className={styles.docList}>
        <div className={styles.pageSizeRow} onClick={exportToPDF}>
          <div className={styles.documentIcon}>PDF</div>{" "}
          {generateLangaugeText(lang, i18n?.language, "Export to PDF") ||
            "Export to PDF"}
          {pdfLoader && <CircularProgress size={14} />}
        </div>
        <div className={styles.pageSizeRow} onClick={exportToHTML}>
          <div className={styles.documentIcon}>
            {generateLangaugeText(lang, i18n?.language, "Variable")}
          </div>
          {generateLangaugeText(lang, i18n?.language, "Set variables")}
          {htmlLoader && <CircularProgress size={14} />}
        </div>

        {selectedTemplate ? (
          <LinkedListTables
            setSelectedOutputTable={setSelectedOutputTable}
            selectedOutputTable={selectedOutputTable}
            selectedOutputObject={selectedOutputObject}
            setSelectedOutputObject={setSelectedOutputObject}
            templates={templates}
            selectedTemplate={selectedTemplate}
            selectedLinkedObject={selectedLinkedObject}
            setSelectedLinkedObject={setSelectedLinkedObject}
            setSelectedObject={setSelectedObject}
            selectedObject={selectedObject}
            setlLinkedObjectView={setlLinkedObjectView}
            exportToHTML={exportToHTML}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ExportBlock;
