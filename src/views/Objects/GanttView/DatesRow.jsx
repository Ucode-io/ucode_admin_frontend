
import { format } from "date-fns";
import { useMemo } from "react";
import styles from "./style.module.scss"

const DatesRow = ({ datesList }) => {

  const computedDatesList = useMemo(() => {

    const result = {}

    datesList.forEach(date => {

      // const month = format(date)

    })


  }, [])


  return ( <div className={styles.datesRow}>

    <div className={`${styles.dateBlock} ${styles.mockBlock}`} />
    {
      datesList?.map((date) => (
        <div key={date} className={styles.dateBlock}>
          {format(date, "dd.MM")}
        </div>
      ))
    }

  </div> );
}
 
export default DatesRow;