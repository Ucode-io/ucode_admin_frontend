import FormElementGenerator from "../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";

const SummarySection = ({ mainForm, control, computedSummary }) => {
  const fields = computedSummary?.fields ?? [];
  return (
    <div className={styles.summarySection}>
      {fields?.map((field, fieldIndex) => (
        <div className={styles.field_summary}>
          <FormElementGenerator
            control={control}
            field={field}
            isLayout={true}
            sectionIndex={fieldIndex}
            column={1}
            fieldIndex={fieldIndex}
            mainForm={mainForm}
          />
        </div>
      ))}
    </div>
  );
};

export default SummarySection;
