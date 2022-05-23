import FiltersBlock from "../../../components/FiltersBlock"
import DatesRow from "./DatesRow"
import MainFieldRow from "./MainFieldRow"
import ObjectColumn from "./ObjectColumn"
import styles from "./style.module.scss"
import TimesBlock from "./TimesBlock"

const CalendarView = () => {
  return (
    <div>
      <FiltersBlock />

      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.wrapper}>
            <DatesRow />

            <MainFieldRow />

            <div className={styles.calendar}>
              <TimesBlock />

              <ObjectColumn />
              <ObjectColumn />
              <ObjectColumn />
              <ObjectColumn />
              <ObjectColumn />
              <ObjectColumn />
              <ObjectColumn />

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
