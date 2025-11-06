import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./month.module.scss";
import { Box } from "@mui/material";
import ModalDetailPage from "../../ModalDetailPage/ModalDetailPage";
import DataMonthCard from "./DataMonthCard";
import { dateValidFormat } from "../../../../utils/dateValidFormat";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  setHours,
  setMinutes,
  startOfMonth,
  subMonths,
} from "date-fns";
import DrawerDetailPage from "../../DrawerDetailPage";
import { useProjectGetByIdQuery } from "../../../../services/projectService";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import layoutService from "../../../../services/layoutService";
import { useParams } from "react-router-dom";
import MaterialUIProvider from "../../../../providers/MaterialUIProvider";
import AddIcon from "@mui/icons-material/Add";
import clsx from "clsx";
import { useCalendarViewContext } from "../Providers";
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const startOfMonthAligned = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = (start.getDay() + 6) % 7; // Понедельник = 0
  start.setDate(start.getDate() - dayOfWeek);
  return start;
};

const endOfMonthAligned = (date) => {
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Последний день месяца
  const dayOfWeek = (end.getDay() + 6) % 7; // Понедельник = 0
  end.setDate(end.getDate() + (6 - dayOfWeek));
  return end;
};

const getDaysRange = (centerDate, monthsBefore, monthsAfter) => {
  const start = startOfMonthAligned(
    new Date(centerDate.getFullYear(), centerDate.getMonth() - monthsBefore, 1)
  );

  const end = endOfMonthAligned(
    new Date(centerDate.getFullYear(), centerDate.getMonth() + monthsAfter, 1)
  );

  const days = [];
  let current = new Date(start);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

const getCalendarMatrix = (dates) => {
  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }
  return weeks;
};

const CalendarTemplate = ({
  month = [],
  data,
  view,
  fieldsMap,
  menuItem,
  setLayoutType,
  currentDay,
  tableSlug: tableSlugFromProp,
}) => {
  const [open, setOpen] = useState();
  const [dateInfo, setDateInfo] = useState({});

  const [selectedRow, setSelectedRow] = useState({});
  const [defaultValue, setDefaultValue] = useState(null);

  const { tableSlug: tableSlugFromParam, appId } = useParams();

  const tableSlug = tableSlugFromProp || tableSlugFromParam;

  const projectId = useSelector((state) => state.company?.projectId);

  const navigateToCreatePage = async (time) => {
    const hour = Number(format(time, "H"));
    const minute = Number(format(time, "m"));
    const computedDate = await setHours(setMinutes(time, minute), hour);
    const startTimeStampSlug = view?.calendar_from_slug;

    setDateInfo({
      [startTimeStampSlug]: computedDate,
    });
    setOpen(true);
  };

  const navigateToEditPage = (el) => {
    setOpen(true);
    setSelectedRow(el);
    setDateInfo({});
  };

  const viewFields = useMemo(() => {
    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el);
  }, [fieldsMap, view]);

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage"),
  );

  const {
    data: { layout } = {
      layout: [],
    },
  } = useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return layoutService.getLayout(tableSlug, appId);
    },
    select: (data) => {
      return {
        layout: data ?? {},
      };
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  const formattedToday = dateValidFormat(new Date(), "dd.MM.yyyy");

  const { calendarRef = {}, setDateRangeFilter = () => {} } =
    useCalendarViewContext();

  const [dates, setDates] = useState([]);
  const today = new Date();

  useEffect(() => {
    const initial = getDaysRange(today, 2, 2);
    setDates(initial);
  }, []);

  const addMorePast = () => {
    const first = dates[0];
    const newDates = getDaysRange(subMonths(first, 2), 0, 2);
    const filtered = newDates.filter((d) => d.getTime() < first.getTime());
    const combined = [...filtered, ...dates];
    setDates(combined);
    setDateRangeFilter([combined[0], combined[combined.length - 1]]);

    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.scrollTop += 500;
      }
    }, 0);
  };

  const addMoreFuture = () => {
    const last = dates[dates.length - 1];
    const newDates = getDaysRange(addMonths(last, -1), 0, 2);
    const filtered = newDates.filter((d) => d.getTime() > last.getTime());
    const combined = [...dates, ...filtered];
    setDates(combined);
    setDateRangeFilter([combined[0], combined[combined.length - 1]]);
  };

  const handleScroll = (e) => {
    const el = e.target;

    if (el.scrollTop <= 100) {
      addMorePast();
    }
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      addMoreFuture();
    }
  };

  const weeks = getCalendarMatrix(dates);

  return (
    <>
      <Box className={styles.calendarTemplate}>
        {daysOfWeek?.map((date, index) => (
          <Box
            key={index}
            className={styles.days}
            style={
              {
                // borderColor: new Date().getDay() === index ? "#007AFF" : "",
              }
            }
          >
            {date}
          </Box>
        ))}
      </Box>
      <Box
        className={clsx(styles.calendarTemplate, styles.calendarTemplateData)}
        onScroll={handleScroll}
        ref={calendarRef}
      >
        {Array.isArray(weeks) &&
          weeks?.map((week, index) => (
            <>
              {week?.map((date, index) => (
                <Box
                  key={index}
                  data-week-start={week[0].toISOString()}
                  data-is-today={
                    formattedToday === dateValidFormat(date, "dd.MM.yyyy")
                  }
                  className={clsx(styles.calendar, {
                    [styles.today]:
                      formattedToday === dateValidFormat(date, "dd.MM.yyyy"),
                    [styles.activeMonth]:
                      currentDay.getMonth() === date?.getMonth(),
                  })}
                  style={{
                    background:
                      date?.getDay() === 0 || date?.getDay() === 6
                        ? "#f5f4f4"
                        : "",
                  }}
                >
                  {!data?.includes(date) && (
                    <Box
                      className={styles.desc}
                      onClick={() => navigateToCreatePage(date)}
                    >
                      <Box className={`${styles.addButton}`}>
                        <AddIcon color="inherit" />
                      </Box>
                    </Box>
                  )}
                  <div className={styles.dateNumber}>
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

                  <Box className={styles.card}>
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
          ))}
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
          dateInfo={dateInfo}
          defaultValue={defaultValue}
        />
      </MaterialUIProvider>
    </>
  );
};

export default CalendarTemplate;
