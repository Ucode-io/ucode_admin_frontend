import {
  add,
  differenceInDays,
  endOfWeek,
  format,
  startOfWeek,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueries, useQuery } from "react-query";
import useFilters from "@/hooks/useFilters";
import constructorObjectService from "@/services/constructorObjectService";
import { getRelationFieldTabsLabel } from "@/utils/getRelationFieldLabel";
import { listToMapForCalendar } from "@/utils/listToMap";
import { selectElementFromEndOfString } from "@/utils/selectElementFromEnd";
import style from "./style.module.scss";
import CalendarDay from "./CalendarDay";
import { Box } from "@mui/material";
import CalendarDayRange from "./DateDayRange";
import CalendarWeekRange from "./CalendarWeek/CalendarWeekRange";
import CalendarWeek from "./CalendarWeek";
import CalendarCols from "./CalendarCols";
import CalendarMonth from "./CalendarMonth";
import { dateFormat } from "@/utils/dateFormat";
import { FromDateType, ToDateType } from "@/utils/getDateType";
import { CalendarViewProvider } from "./Providers";
import { CalendarMonthRange } from "./components/CalendarMonthRange";
import { useViewContext } from "@/providers/ViewProvider";

const formatDate = [
  {
    value: "DAY",
    label: "Day",
  },
  {
    value: "WEEK",
    label: "Week",
  },
  {
    value: "MONTH",
    label: "Month",
  },
];

export const Calendar = () => {

  const {
    tableSlug,
    menuItem,
    view,
    layoutType,
    setLayoutType,
    isRelationView,
  } = useViewContext();

  const [selectedView, setSelectedView] = useState(null);
  const [dateFilters] = useState([
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek(new Date(), { weekStartsOn: 1 }),
  ]);
  const [fieldsMap, setFieldsMap] = useState({});
  const [date] = useState(
    view?.attributes?.period ?? "MONTH"
  );

  const [focusedDate, setFocusedDate] = useState(new Date());

  const [currentDay, setCurrentDay] = useState(new Date());

  const [weekDates, setWeekDates] = useState(new Date());
  const [currentMonthDates] = useState([]);
  const [firstDate, setFirstDate] = useState();
  const [lastDate, setLastDate] = useState();
  const currentUpdatedDate = dateFormat(currentDay, 0);
  const tomorrow = dateFormat(currentDay, 1);
  const lastUpdatedDate = dateFormat(lastDate, 1);
  const firstUpdatedDate = dateFormat(firstDate, 0);

  const startWeek = (date) => {
    const currentDayOfWeek = date.getDay();
    const start = new Date(date);
    start.setDate(date.getDate() - currentDayOfWeek + 1);
    return start;
  };
  // const startOfMonth = (date) => {
  //   const start = new Date(date.getFullYear(), date.getMonth(), 1);
  //   if (start.getDay() !== 0) {
  //     start.setDate(2 - start.getDay());
  //   }
  //   return start;
  // };

  useEffect(() => {
    if (date !== "WEEK") return;

    const newWeekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startWeek(currentDay));
      day.setDate(startWeek(currentDay).getDate() + i);
      newWeekDates && newWeekDates.push(day);
    }
    setWeekDates(newWeekDates);
  }, [currentDay]);

  // useEffect(() => {
  //   if (date !== "MONTH") return;

  //   const newDates = getDaysRange(currentDay, 2, 2);
  //   setCurrentMonthDates(newDates);

  //   const newMonthDates = [];
  //   for (let i = 0; i < daysCount; i++) {
  //     const day = new Date(startOfMonth(currentDay));
  //     day.setDate(startOfMonth(currentDay).getDate() + i);
  //     newMonthDates.push(day);
  //   }

  //   setCurrentMonthDates(newMonthDates);
  // }, [currentDay]);

  const datesList = useMemo(() => {
    if (!dateFilters?.[0] || !dateFilters?.[1]) return;

    const differenceDays = differenceInDays(dateFilters[1], dateFilters[0]);

    const result = [];
    for (let i = 0; i <= differenceDays; i++) {
      result.push(add(dateFilters[0], { days: i }));
    }
    return result;
  }, [dateFilters]);

  const { filters, dataFilters } = useFilters(tableSlug, view.id);
  const groupFieldIds = view.group_fields;
  const groupFields = groupFieldIds
    ?.map((id) => fieldsMap?.[id])
    ?.filter((el) => el);

  const { data: { data } = { data: [] } } = useQuery(
    [
      "GET_OBJECTS_LIST_WITH_RELATIONS",
      { tableSlug, dataFilters, currentUpdatedDate, firstUpdatedDate, date },
    ],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {
          with_relations: true,
          [view.calendar_from_slug || view?.attributes?.calendar_from_slug]: {
            $gte:
              FromDateType(date, currentUpdatedDate, firstUpdatedDate) ?? "",
            $lt: ToDateType(date, tomorrow, lastUpdatedDate) ?? "",
          },
          view_type: "CALENDAR",
          ...dataFilters,
        },
      });
    },
    {
      cacheTime: 10,
      enabled: Boolean(tableSlug),
      select: (res) => {
        const fields = res.data?.fields ?? [];
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [];
        const fieldsMap = listToMapForCalendar([...fields, ...relationFields]);
        const data = res.data?.response?.map((row) => ({
          ...row,
          calendar: {
            date: row[
              view.calendar_from_slug ?? view?.attributes?.calendar_from_slug
            ]
              ? format(
                  new Date(
                    row[
                      view.calendar_from_slug ??
                        view?.attributes?.calendar_from_slug
                    ]
                  ),
                  "dd.MM.yyyy"
                )
              : null,
            elementFromTime: row[
              view.calendar_from_slug ?? view?.attributes?.calendar_from_slug
            ]
              ? new Date(
                  row[
                    view.calendar_from_slug ??
                      view?.attributes?.calendar_from_slug
                  ]
                )
              : null,
            elementToTime: row[
              view.calendar_to_slug ?? view?.attributes?.calendar_to_slug
            ]
              ? new Date(
                  row[
                    view.calendar_to_slug ?? view?.attributes?.calendar_to_slug
                  ]
                )
              : null,
          },
        }));
        return {
          fieldsMap,
          data,
        };
      },
      onSuccess: (res) => {
        if (Object.keys(fieldsMap)?.length) return;
        setFieldsMap(res.fieldsMap);
      },
    }
  );

  const { data: workingDays } = useQuery(
    [
      "GET_OBJECTS_LIST",
      view?.disable_dates?.table_slug,
      currentDay,
      firstDate,
    ],
    () => {
      if (!view?.disable_dates?.table_slug) return {};

      return constructorObjectService.getList(view?.disable_dates?.table_slug, {
        data: {
          [view.disable_dates.day_slug]: {
            $gte:
              FromDateType(date, currentUpdatedDate, firstUpdatedDate) ?? "",
            $lt: ToDateType(date, tomorrow, lastUpdatedDate) ?? "",
          },
        },
      });
    },
    {
      enabled: Boolean(view?.disable_dates?.table_slug),
      select: (res) => {
        const result = {};
        res?.data?.response?.forEach((el) => {
          const date = el[view?.disable_dates?.day_slug];
          const calendarFromTime = el[view?.disable_dates?.time_from_slug];
          const calendarToTime = el[view?.disable_dates?.time_to_slug];

          if (date) {
            const formattedDate = format(new Date(date), "dd.MM.yyyy");

            if (!result[formattedDate]?.[0]) {
              result[formattedDate] = [
                {
                  ...el,
                  calendarFromTime,
                  calendarToTime,
                },
              ];
            } else {
              result[formattedDate].push({
                ...el,
                calendarFromTime,
                calendarToTime,
              });
            }
          }
        });

        return result;
      },
    }
  );

  const tabResponses = useQueries(
    queryGenerator(groupFields ?? [], filters ?? {})
  );

  const tabs = tabResponses?.map((response) => response?.data);

  const calendarRef = useRef(null);

  return (
    <CalendarViewProvider
      value={{
        calendarRef,
        setCurrentDay,
        currentDay,
        data,
        view,
        fieldsMap,
        menuItem,
        setLayoutType,
        focusedDate,
        setFocusedDate,
        tableSlug,
        selectedView,
        setSelectedView,
        layoutType,
      }}
    >
      <div>
        <Box className={style.navbar}>
          {date === "DAY" && (
            <CalendarDayRange
              datesList={datesList}
              formatDate={formatDate}
              date={date}
              currentDay={currentDay}
              setCurrentDay={setCurrentDay}
            />
          )}
          {date === "WEEK" && (
            <CalendarWeekRange
              formatDate={formatDate}
              date={date}
              setCurrentDay={setCurrentDay}
              currentDay={currentDay}
              weekDates={weekDates}
              setFirstDate={setFirstDate}
              firstDate={firstDate}
              setLastDate={setLastDate}
              lastDate={lastDate}
              setWeekDates={setWeekDates}
            />
          )}
          {date === "MONTH" && (
            <CalendarMonthRange
              formatDate={formatDate}
              date={date}
              setCurrentDay={setCurrentDay}
              currentDay={currentDay}
              relationView={isRelationView}
            />
          )}
          <Box className={style.extra}></Box>
        </Box>
        <Box>
          {date === "DAY" && (
            <CalendarDay
              data={data}
              fieldsMap={fieldsMap}
              datesList={[currentDay]}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
            />
          )}
          {date === "WEEK" && (
            <CalendarWeek
              data={data}
              fieldsMap={fieldsMap}
              datesList={weekDates?.length && weekDates}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
            />
          )}
          {date === "MONTH" && (
            <CalendarMonth
              data={data}
              fieldsMap={fieldsMap}
              datesList={currentMonthDates?.length && currentMonthDates}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
              layoutType={layoutType}
              setLayoutType={setLayoutType}
              menuItem={menuItem}
              currentDay={currentDay}
              relationView={isRelationView}
            />
          )}
          {date !== "WEEK" && date !== "DAY" && date !== "MONTH" ? (
            <CalendarCols
              data={data}
              fieldsMap={fieldsMap}
              datesList={datesList}
              view={view}
              tabs={tabs}
              workingDays={workingDays}
            />
          ) : null}
        </Box>
        {/* )} */}
      </div>
    </CalendarViewProvider>
  );
};

// ========== UTILS==========

const queryGenerator = (groupFields, filters = {}) => {
  return groupFields?.map((field) => promiseGenerator(field, filters));
};

const promiseGenerator = (groupField, filters = {}) => {
  const filterValue = filters[groupField.slug] ?? filters;
  const defaultFilters = filterValue ? {[groupField.slug]: filterValue} : {};
  const relationFilters = {};

  Object.entries(filters)?.forEach(([key, value]) => {
    if (!key?.includes(".")) return;

    const filterTableSlug = selectElementFromEndOfString({
      string: key,
      separator: ".",
      index: 2,
    });

    const slug = key.split(".")?.pop();

    if (filterTableSlug === groupField.table_slug) {
      const slug = key.split(".")?.pop();
      relationFilters[slug] = value;
    } else {
      if (groupField.slug === slug) {
        const slug = key.split(".")?.pop();
        relationFilters[slug] = value;
      }
    }
  });

  const objectSlug = Object.keys(filters)?.[0]?.split(".").pop();
  const slugValue = Object.values(filters)?.[0];
  const computedFilters = {...defaultFilters, ...relationFilters};
  const computedFilterValue = {[objectSlug]: slugValue};
  if (groupField?.type === "PICK_LIST") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () => ({
        id: groupField.id,
        list: groupField.attributes?.options?.map((el) => ({
          ...el,
          label: el,
          value: el,
          slug: groupField?.slug,
        })),
      }),
    };
  }

  if (groupField?.type === "LOOKUP" || groupField?.type === "LOOKUPS") {
    const queryFn = () =>
      constructorObjectService.getListV2(
        groupField?.type === "LOOKUP"
          ? groupField.slug?.slice(0, -3)
          : groupField.slug?.slice(0, -4),
        {
          data: computedFilterValue,
        }
      );

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        {
          tableSlug:
            groupField?.type === "LOOKUP"
              ? groupField.slug?.slice(0, -3)
              : groupField.slug?.slice(0, -4),
          filters: computedFilters,
        },
      ],
      queryFn,
      select: (res) => ({
        id: groupField.id,
        list: res.data?.response?.map((el) => ({
          ...el,
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        })),
      }),
    };
  }
};
