import { format } from "date-fns";
import styles from "./week.module.scss";
import RecursiveWeekBlock from "./RecursiveWeekBlock";

const CalendarWeekColumn = ({
  date,
  data,
  fieldsMap,
  view,
  tabs,
  workingDays,
}) => {
  return (
    <div>
      <div className={styles.dateBlock}>{format(date, "dd MMMM yyyy")}</div>

      <RecursiveWeekBlock
        date={date}
        data={data}
        fieldsMap={fieldsMap}
        view={view}
        tabs={tabs}
        workingDays={workingDays}
      />
    </div>
  );
};

export default CalendarWeekColumn;
