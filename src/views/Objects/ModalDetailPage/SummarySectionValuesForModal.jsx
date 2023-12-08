import React from "react";
import styles from "./style.module.scss";
import ValueGenerator from "../SummarySection/ValueGenerator";

export default function SummarySectionValuesForModal({ control, computedSummary }) {
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
}
