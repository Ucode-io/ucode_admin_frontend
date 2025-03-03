import { useTranslation } from "react-i18next";
import { useGetLang } from "../../../hooks/useGetLang";
import usePaperSize from "../../../hooks/usePaperSize";
import styles from "./style.module.scss";
import { generateLangaugeText } from "../../../utils/generateLanguageText";

const PageSizeBlock = ({
  selectedPaperSizeIndex,
  setSelectedPaperSizeIndex,
}) => {
  const { paperSizes } = usePaperSize();

  const { i18n } = useTranslation();

  const lang = useGetLang("Table");

  return (
    <div className={styles.docListBlock}>
      <div className={styles.doclistHeader}>
        <div className={styles.doclistHeaderTitle}>
          {generateLangaugeText(lang, i18n?.language, "Format document") ||
            "Format document"}
        </div>
      </div>

      <div className={styles.docList}>
        <div className={styles.pageSizeRow}>
          <h3>
            {generateLangaugeText(lang, i18n?.language, "Paper") || "Paper"}
          </h3>
        </div>

        {paperSizes.map((paper, index) => (
          <div
            onClick={() => setSelectedPaperSizeIndex(index)}
            key={paper.name}
            className={`${styles.pageSizeRow} ${selectedPaperSizeIndex === index ? styles.pageSizeRowActive : ""}`}
          >
            {paper.withTranslation
              ? generateLangaugeText(lang, i18n?.language, paper.name)
              : paper.name}
            <span className={styles.pageSizeValue}>
              {paper.width} x {paper.height}
            </span>
          </div>
        ))}

        {/* {templates?.map((template) => (
          <div
            key={template.id}
            className={`${styles.row} ${
              selectedTemplate?.id === template.id ? styles.active : ""
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            {template.title}
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default PageSizeBlock;
