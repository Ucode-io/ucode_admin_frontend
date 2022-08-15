
import { timesList } from "../../../utils/timesList";
import styles from "./style.module.scss"

const MockColumn = () => {
  return ( <div className={styles.objectColumn}>
    {timesList.map((time, index) => (
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