

import { format } from "date-fns";
import RecursiveBlock from "./RecursiveBlock";
import styles from "./style.module.scss"

const CalendarColumn = ({date, data, fieldsMap, view, tabs}) => {
  return ( <div>
    <div className={styles.dateBlock}>{format(date, "dd MMMM yyyy")}</div>


    <RecursiveBlock date={date} data={data} fieldsMap={fieldsMap} view={view} tabs={tabs} />

  </div> );
}
 
export default CalendarColumn;