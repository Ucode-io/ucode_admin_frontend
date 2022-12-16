import styles from "./style.module.scss"
import AddIcon from "@mui/icons-material/Add"
import AddRoadIcon from "@mui/icons-material/AddRoad"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"

const SummarySection = () => {
  return (
    <div className={styles.summarySection}>
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
  )
}

export default SummarySection
