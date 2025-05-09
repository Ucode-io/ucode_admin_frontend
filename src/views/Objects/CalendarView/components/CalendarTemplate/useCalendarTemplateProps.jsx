import { useEffect, useMemo, useRef, useState } from "react";
import { dateValidFormat } from "@/utils/dateValidFormat";
import {
  addMonths,
  format,
  setHours,
  setMinutes,
  subMonths,
} from "date-fns";
import { useProjectGetByIdQuery } from "@/services/projectService";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import layoutService from "@/services/layoutService";
import { useCalendarViewContext } from "../../Providers";

export const useCalendarTemplateProps = () => {
  const {
    data,
    view,
    fieldsMap,
    menuItem,
    setLayoutType,
    currentDay,
    setFocusedDate,
  } = useCalendarViewContext();

  const projectId = useSelector((state) => state.company?.projectId);

  const [open, setOpen] = useState();
  const [defaultValue, setDefaultValue] = useState({});

  const [isScrolling, setIsScrolling] = useState(false);

  const [selectedRow, setSelectedRow] = useState({});
  const [focusedMonth, setFocusedMonth] = useState(currentDay.getMonth());

  const { tableSlug, appId } = useParams();

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
      new Date(
        centerDate.getFullYear(),
        centerDate.getMonth() - monthsBefore,
        1
      )
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

  const getCenterChild = (container) => {
    const containerRect = container.getBoundingClientRect();
    const containerCenterY = containerRect.top + containerRect.height / 2;

    let closestEl = null;
    let minDistance = Infinity;

    const children = Array.from(container.children);

    for (const child of children) {
      const rect = child.getBoundingClientRect();
      const childCenterY = rect.top + rect.height / 2;

      const distance = Math.abs(childCenterY - containerCenterY);

      if (distance < minDistance) {
        minDistance = distance;
        closestEl = child;
      }
    }

    return closestEl;
  };

  const navigateToCreatePage = async (time) => {
    const hour = Number(format(time, "H"));
    const minute = Number(format(time, "m"));
    const computedDate = await setHours(setMinutes(time, minute), hour);
    const startTimeStampSlug = view?.calendar_from_slug;

    setDefaultValue({
      field: startTimeStampSlug,
      value: computedDate,
    });
    setOpen(true);
  };

  const navigateToEditPage = (el) => {
    setOpen(true);
    setSelectedRow(el);
    setDefaultValue({});
  };

  const viewFields = useMemo(() => {
    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el);
  }, [fieldsMap, view]);

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage") === "FullPage"
      ? "SidePeek"
      : localStorage?.getItem("detailPage")
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

  const today = new Date();
  const initial = getDaysRange(today, 3, 3);

  const [dates, setDates] = useState(initial);

  const getFirstMondayFromWeeks = (weeks, monthDate) => {
    const targetMonth = monthDate.getMonth();
    const targetYear = monthDate.getFullYear();

    for (const week of weeks) {
      for (const date of week) {
        const isSameMonth =
          date.getMonth() === targetMonth && date.getFullYear() === targetYear;
        const isMonday = date.getDay() === 1;
        if (isSameMonth && isMonday) {
          return date;
        }
      }
    }

    return null;
  };

  const addMorePast = async () => {
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

  const addMoreFuture = async () => {
    const last = dates[dates.length - 1];
    const newDates = getDaysRange(addMonths(last, -1), 0, 2);
    const filtered = newDates.filter((d) => d.getTime() > last.getTime());
    const combined = [...dates, ...filtered];
    setDates(combined);
    setDateRangeFilter([combined[0], combined[combined.length - 1]]);
  };

  const scrollTimeout = useRef(null);

  const scrollByMonth = (direction) => {
    if (calendarRef.current) {
      const scrollAmount = calendarRef.current.clientHeight - 135;
      calendarRef.current.scrollBy({
        top: direction === "up" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const monthRefs = useRef([]);

  // const lastScrollTop = useRef(0);
  // const lastScrollTime = useRef(Date.now());

  // const onScroll = () => {
  //   const container = calendarRef.current;
  //   if (!container) return;

  //   const currentScrollTop = container.scrollTop;
  //   const now = Date.now();
  //   const timeDiff = now - lastScrollTime.current;
  //   const scrollDiff = currentScrollTop - lastScrollTop.current;

  //   if (Math.abs(scrollDiff) > 150 && timeDiff < 100) {
  //     const direction = scrollDiff > 0 ? "down" : "up";
  //     scrollByMonth(direction);
  //   }

  //   lastScrollTop.current = currentScrollTop;
  //   lastScrollTime.current = now;
  // };

  const handleScroll = (e) => {
    const el = e.target;

    setIsScrolling(true);

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 300);

    const centerChild = getCenterChild(e.target);

    const currentDay = new Date(centerChild?.dataset?.date);

    if (focusedMonth !== currentDay.getMonth()) {
      setFocusedMonth(currentDay.getMonth());
      setFocusedDate(currentDay);
    }

    if (el.scrollTop <= 300) {
      addMorePast().then(() => {
        requestAnimationFrame(() => {
          el.scrollTop += 500;
        });
      });
    }
    if (el.scrollHeight - el.scrollTop - el.clientHeight <= 200) {
      addMoreFuture().then(() => {
        requestAnimationFrame(() => {
          el.scrollTop += 500;
        });
      });
    }
    // onScroll();
  };

  const [td, setTd] = useState(null);

  const handleScrollToToday = () => {
    if (calendarRef?.current) {
      const elToday = calendarRef.current.querySelector(
        "[data-is-today = true]"
      );
      if (elToday) {
        setTd(elToday);
        const top = elToday.offsetTop - calendarRef.current.offsetTop;
        calendarRef.current.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        handleScrollToToday();
      }, 100);
    });
  }, [td]);

  const weeks = getCalendarMatrix(dates);

  return {
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
  };
}
