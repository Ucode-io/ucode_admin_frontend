import TimesColumn from "../CalendarView-baaackup/TimesColumn"
import CalendarColumn from "./CalendarColumn"
import styles from "./style.module.scss"

const Calendar = ({ data, fieldsMap, datesList, view, tabs, workingDays }) => {
  return (
    <div className={styles.calendar}>
      <TimesColumn />

      {datesList?.map((date) => (
        <CalendarColumn
          key={date}
          date={date}
          data={data}
          fieldsMap={fieldsMap}
          view={view}
          tabs={tabs}
          workingDays={workingDays}
        />
      ))}
    </div>
  )
}

export default Calendar
