import FormElementGenerator from "../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";
import AddIcon from "@mui/icons-material/Add";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { format } from "date-fns";

const SummarySection = ({
  getValues,
  mainForm,
  control,
  register,
  computedSections,
}) => {
  const fields = computedSections?.fields ?? [];
  const today = new Date().getFullYear();

  const birthYear =
    getValues("birth_date") !== ""
      ? today - format(new Date(getValues("birth_date")), "yyyy")
      : 0;
  const birthDate =
    getValues("birth_date") !== ""
      ? `${birthYear} (${format(
          new Date(getValues("birth_date")),
          "dd-MM-yyyy"
        )})`
      : 0;
  return (
    <div className={styles.summarySection}>
      <div className={styles.field_summary}>
        <div className={styles.field_summary_item}>
          Id
          <input type="text" {...register("increment_id")} />
        </div>
        <div className={styles.field_summary_item}>
          Возраст
          <input type="text" value={birthDate} disabled />
        </div>
        <div className={styles.field_summary_item}>
          Пол
          <input type="text" {...register("gender")} disabled />
        </div>
        <div className={styles.field_summary_item}>
          номер телефона
          <input type="text" {...register("phone")} disabled />
        </div>
        <div className={styles.field_summary_item}>
          Адрес
          <input type="text" {...register("address")} disabled />
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
