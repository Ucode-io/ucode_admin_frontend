import cls from "./styles.module.scss";
import TimeLineDatesRow from "../../TimeLineDatesRow";
import { MoveableTask } from "../MoveableTask";
import { useMoveableGridProps } from "./useMoveableGridProps";

export const MoveableGrid = ({
  computedData,
  months,
  datesList,
  zoomPosition,
  selectedType,
  setMonths,
}) => {

  const {
    focusedDays,
    calendarRef,
    getTaskWidth,
    calculatedDays,
    handleScroll,
  } = useMoveableGridProps({ months, setMonths });

  return <div className={cls.timeLineContainer} ref={calendarRef}>
    <TimeLineDatesRow
      focusedDays={focusedDays}
      datesList={datesList}
      zoomPosition={zoomPosition}
      selectedType={selectedType}
      months={months}
    />
      {/* Ряды задач */}
      
    <div className={cls.timeLineLines}>
      {computedData.map((task, rowIndex) => (
        <div className={cls.timeLineLine}>
          <MoveableTask
            key={task.id}
            task={task}
            rowIndex={rowIndex}
            months={months}
            dayWidth={getTaskWidth(task.start_date, task.end_date, 60)} // ширина одной ячейки
          />
        </div>
      ))}
    </div>
  </div>
}
