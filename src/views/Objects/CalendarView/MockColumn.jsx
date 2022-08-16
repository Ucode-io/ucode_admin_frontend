
import useTimeList from "../../../hooks/useTimeList";
import styles from "./style.module.scss"

const MockColumn = ({ view }) => {
  const { timeList } = useTimeList(view.time_interval)



  return ( <div className={styles.objectColumn}>
    {timeList.map((time, index) => (
      <div
        key={time}
        className={`${styles.timeBlock} ${styles.disabled}`}
        style={{ overflow: "auto" }}
      >
      </div>
    ))}
  </div> );
}
 
export default MockColumn;