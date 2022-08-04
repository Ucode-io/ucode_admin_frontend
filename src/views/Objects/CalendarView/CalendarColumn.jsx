import { format } from "date-fns"
import {
  getRelationFieldTabsLabel,
} from "../../../utils/getRelationFieldLabel"
import MockColumn from "./MockColumn"
import RecursiveBlock from "./RecursiveBlock"
import styles from "./style.module.scss"

const CalendarColumn = ({ date, computedData, groupColumns, view }) => {

  return (
    <div>
      <div className={styles.dateBlock}>{format(date, "dd MMMM yyyy")}</div>

      <div className={styles.row}>
        {computedData?.map((el) => (
          <>
          <div className={styles.block}>
            <div className={styles.blockElement} >{getRelationFieldTabsLabel(groupColumns[0], el)}</div>

            {!el.child?.length ? <MockColumn /> : <RecursiveBlock date={date} computedData={el?.child} groupColumns={groupColumns} level={1} view={view} />}

          </div>
          
          </>
        ))}
      
      </div>

      

    </div>
  )
}

export default CalendarColumn
