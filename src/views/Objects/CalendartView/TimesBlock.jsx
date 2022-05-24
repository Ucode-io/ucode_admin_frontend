import { timesList } from "../../../utils/timesList"
import styles from "./style.module.scss"

const TimesBlock = () => {
  return (
    <div className={styles.timesBlock}>
      {timesList.map((time) => (
        <div key={time} className={styles.timeBlock}>
          {time}
        </div>
      ))}
    </div>
  )
}

export default TimesBlock
