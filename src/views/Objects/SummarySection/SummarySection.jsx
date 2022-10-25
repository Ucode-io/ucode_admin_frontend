import FormElementGenerator from "../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";

const SummarySection = ({ mainForm, control, computedSummary }) => {
  const fields = computedSummary?.fields ?? [];
  return (
    <div className={styles.summarySection}>
      {fields?.map((field, fieldIndex) => (
        <div className={styles.field_summary}>
          <h2>{field?.label}</h2>
          <div className={styles.field_summary_item}>{field?.slug}</div>
        </div>
      ))}
    </div>
  );
};

export default SummarySection;
