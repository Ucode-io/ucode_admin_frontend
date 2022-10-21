import FormElementGenerator from "../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";
import AddIcon from "@mui/icons-material/Add";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const SummarySection = ({ mainForm, control, computedSummary }) => {
  const fields = computedSummary?.fields ?? [];
  return (
    <div className={styles.summarySection}>
      {/* {fields?.map((field, fieldIndex) => ( */}
      <div className={styles.field_summary}>
        <button className={styles.object_btns}>
          <CalendarTodayIcon style={{ color: "#6E8BB7" }} />
        </button>
        <button className={styles.object_btns}>
          <AddRoadIcon style={{ color: "#6E8BB7" }} />
        </button>
        <button className={styles.object_btns}>
          <AddIcon style={{ color: "#6E8BB7" }} />
        </button>
      </div>
      {/* ))} */}
    </div>
  );
};

export default SummarySection;
{
  /* <FormElementGenerator
            control={control}
            field={field}
            isLayout={true}
            sectionIndex={fieldIndex}
            column={1}
            fieldIndex={fieldIndex}
            mainForm={mainForm}
          /> */
}
