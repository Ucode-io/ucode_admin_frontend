import clsx from "clsx";
import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCalendarTemplateProps } from "./useCalendarTemplateProps";
import { dateValidFormat } from "@/utils/dateValidFormat";
import MaterialUIProvider from "@/providers/MaterialUIProvider";
import DrawerDetailPage from "../../../DrawerDetailPage";
import { DataMonthCard } from "../DataMonthCard";
import { format } from "date-fns";

export const CalendarTemplate = () => {

  const {
    weeks,
    daysOfWeek,
    handleScroll,
    calendarRef,
    formattedToday,
    viewFields,
    navigateToCreatePage,
    navigateToEditPage,
    open,
    setOpen,
    selectedRow,
    layout,
    projectInfo,
    selectedViewType,
    setSelectedViewType,
    data,
    menuItem,
    setLayoutType,
    fieldsMap,
    view,
    focusedMonth,
    getFirstMondayFromWeeks,
    isScrolling,
    monthRefs,
    defaultValue,
  } = useCalendarTemplateProps();

  return (
    <>
      <Box className={cls.calendarTemplate}>
        {daysOfWeek?.map((date, index) => (
          <Box key={index} className={cls.days}>
            {date}
          </Box>
        ))}
      </Box>
      <Box
        className={clsx(cls.calendarTemplate, cls.calendarTemplateData)}
        onScroll={handleScroll}
        ref={calendarRef}
      >
        {Array.isArray(weeks) &&
          weeks?.map((week, weekIndex) => {
            const monthKey = format(week[0], "yyyy-MM");
            return (
              <>
                {week?.map((date, index) => (
                  <Box
                    key={index}
                    data-week-start={week[0].toISOString()}
                    data-date={date}
                    data-is-today={
                      formattedToday === dateValidFormat(date, "dd.MM.yyyy")
                    }
                    ref={(el) => {
                      if (el) monthRefs.current[monthKey] = el;
                    }}
                    className={clsx(cls.calendar, {
                      [cls.today]:
                        formattedToday === dateValidFormat(date, "dd.MM.yyyy"),
                      [cls.activeMonth]: focusedMonth === date?.getMonth(),
                    })}
                    style={{
                      background:
                        date?.getDay() === 0 || date?.getDay() === 6
                          ? "#f5f4f4"
                          : "",
                    }}
                  >
                    {(!index && getFirstMondayFromWeeks(weeks, date)
                      ? format(
                          getFirstMondayFromWeeks(weeks, date),
                          "dd.MM.yyyy"
                        ) === format(date, "dd.MM.yyyy")
                      : "") && (
                      <div
                        className={clsx(cls.monthPlaceholder, {
                          [cls.scrolling]: isScrolling,
                        })}
                      >
                        {format(date, "MMMM yyyy")}
                      </div>
                    )}
                    {!data?.includes(date) && (
                      <Box
                        className={cls.desc}
                        onClick={() => navigateToCreatePage(date)}
                      >
                        <Box className={`${cls.addButton}`}>
                          <AddIcon color="inherit" />
                        </Box>
                      </Box>
                    )}
                    <div className={cls.dateNumber}>
                      {new Date(date).toLocaleDateString(
                        "en-US",
                        dateValidFormat(date, "dd") === "01"
                          ? {
                              day: "numeric",
                              //   month: "short",
                            }
                          : {
                              day: "numeric",
                            }
                      )}
                    </div>

                    <Box className={cls.card}>
                      {data?.map((el, idx) =>
                        dateValidFormat(date, "dd.MM.yyyy") ===
                          el?.calendar.date ||
                        dateValidFormat(date, "dd.MM.yyyy") ===
                          dateValidFormat(el?.date_to, "dd.MM.yyyy") ? (
                          <DataMonthCard
                            key={el.id}
                            date={date}
                            view={view}
                            fieldsMap={fieldsMap}
                            data={el}
                            viewFields={viewFields}
                            navigateToEditPage={navigateToEditPage}
                          />
                        ) : null
                      )}
                    </Box>
                  </Box>
                ))}
              </>
            );
          })}
      </Box>

      <MaterialUIProvider>
        <DrawerDetailPage
          projectInfo={projectInfo}
          open={open}
          setOpen={setOpen}
          selectedRow={selectedRow}
          menuItem={menuItem}
          layout={layout}
          fieldsMap={fieldsMap}
          // refetch={refetch}
          setLayoutType={setLayoutType}
          selectedViewType={selectedViewType}
          setSelectedViewType={setSelectedViewType}
          navigateToEditPage={navigateToEditPage}
          defaultValue={defaultValue}
        />
      </MaterialUIProvider>
    </>
  );
};
