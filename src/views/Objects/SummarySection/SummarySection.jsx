import FormElementGenerator from "../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";

const SummarySection = ({ mainForm, control, computedSummary }) => {
  const fields = computedSummary?.fields ?? [];
  return (
    <div className={styles.summarySection}>
      {fields?.map((field, fieldIndex) => (
        <div className={styles.field_summary}>
          <div className={styles.field_summary_item}>
            <span>{field?.label}</span>
            <p>{field?.slug}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummarySection;
