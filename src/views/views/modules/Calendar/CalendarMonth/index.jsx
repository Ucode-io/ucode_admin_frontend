import styles from "../day.module.scss";
import {useRef} from "react";
import { CalendarTemplate } from "../components/CalendarTemplate";

const CalendarMonth = ({
  relationView,
}) => {
  const parentRef = useRef(null);

  return (
    <div className={styles.calendarmonth} ref={parentRef}>
      {/* <TimesColumnMonth view={view} data={data} /> */}
      <CalendarTemplate relationView={relationView} />

      {/* <CalendarTemplate
        month={datesList}
        data={data}
        fieldsMap={fieldsMap}
        view={view}
        layoutType={layoutType}
        setLayoutType={setLayoutType}
        menuItem={menuItem}
        currentDay={currentDay}
      /> */}
      <div
        style={{
          //   width: virtualizer.getTotalSize(),
          height: "100%",
          position: "relative",
        }}
      >
        {/* {datesList?.map((item, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              //   transform: `translateX(${virtualColumn.start}px)`,
            }}
          >
            <CalendarMonthColumn
              date={item}
              data={data}
              fieldsMap={fieldsMap}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
              index={index}
            />
          </div>
        ))} */}
        {/* <DataMonthColumn
          date={datesList}
          data={data}
          fieldsMap={fieldsMap}
          view={view}
          tabs={tabs}
          workingDays={workingDays}
        /> */}
      </div>
    </div>
  );
};

export default CalendarMonth;
