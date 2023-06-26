import { useWatch } from "react-hook-form";
import FormElementGenerator from "../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";
import ValueGenerator from "./ValueGenerator.jsx";

const SummarySectionValue = ({ control, computedSummary }) => {
  return (
    <div className={styles.summarySection}>
      {computedSummary?.map((field) => (
        <div className={styles.field_summary}>
          <div className={styles.field_summary_item}>
            <span>{field?.slug !== "photo" && field?.slug !== "passport_photo" ? field?.label : ""}</span>
            <p>
              <ValueGenerator field={field} control={control} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummarySectionValue;
