
import { format } from "date-fns";
import { useMemo } from "react";
import styles from "./style.module.scss"

const DatesRow = ({ datesList }) => {

  const computedDatesList = useMemo(() => {

    const result = {}
    datesList.forEach(date => {

      const month = format(date, 'MMMM yyyy')

      const day = format(date, 'dd')

      if(result[month]) result[month].days.push(day)
      else result[month] = {
        month,
        days: [day]
      }
    })
    
    return Object.values(result)
  }, [datesList])

  console.log('computedDatesList --->', computedDatesList)


  return ( <div className={styles.datesRow}>

    <div className={styles.mockBlock} />

    {
      computedDatesList.map(({ month, days}) => (
        <div className={styles.dateBlock} >
          <div className={styles.monthBlock} ><span className={styles.monthText} >{ month }</span></div>

          <div className={styles.daysRow}>
            {
              days?.map(day => <div className={styles.dayBlock} >{ day }</div> )
            }
          </div>
        </div>
      ))
    }

    {/* {
      Object.key(computedDatesList).map(month => ())
    } */}


    {/* <div className={`${styles.dateBlock} ${styles.mockBlock}`} />
    {
      datesList?.map((date) => (
        <div key={date} className={styles.dateBlock}>
          {format(date, "dd.MM")}
        </div>
      ))
    } */}

  </div> );
}
 
export default DatesRow;