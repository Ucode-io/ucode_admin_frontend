import { differenceInDays, format, parseISO } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";

export const useMoveableGridProps = ({months, setMonths}) => {
  const [focusedDays, setFocusedDays] = useState([]);

  const calendarRef = useRef(null);
  const isLoading = useRef(false);

  const getTaskWidth = (start, end, dayWidth) => {
    const startDate = parseISO(start); // например "2024-08-05"
    const endDate = parseISO(end);
    const days = differenceInDays(endDate, startDate) + 1;
    return days * dayWidth;
  };

  const calculatedDays = useMemo(() => {
    return months.reduce((acc, month) => {
      return month.days.length + acc
    }, 0)
  }, [months])

  const generateMonth = (monthIndex, year) => {
    const date = new Date(year, monthIndex, 1);
    const days = [];
    const monthName = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    while (date.getMonth() === monthIndex) {
      const day = new Date(date);
      const dayName = day.toLocaleDateString("en-US", { weekday: "long" });
      days.push(`${day.getDate()}/${dayName}`);
      date.setDate(date.getDate() + 1);
    }

    return { month: monthName, days };
  };

  const loadMoreMonths = (direction) => {
    if (isLoading.current) return;
    isLoading.current = true;

    requestAnimationFrame(() => {
      setMonths((prev) => {
        const newMonths = [...prev];
        const lastMonth = newMonths[newMonths.length - 1];
        const firstMonth = newMonths[0];

        if (direction === "right") {
          const [monthName, year] = lastMonth.month.split(" ");
          const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
          for (let i = 0; i < 3; i++) {
            const newMonth = generateMonth(
              (monthIndex + 1 + i) % 12,
              parseInt(year) + (monthIndex + 1 + i > 11 ? 1 : 0)
            );
            if (!newMonths.some((m) => m.month === newMonth.month)) {
              newMonths.push(newMonth);
            }
          }
        } else if (direction === "left") {
          const [monthName, year] = firstMonth.month.split(" ");
          const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
          for (let i = 0; i < 3; i++) {
            const newMonth = generateMonth(
              (monthIndex - 1 - i + 12) % 12,
              parseInt(year) - (monthIndex - 1 - i < 0 ? 1 : 0)
            );
            if (!newMonths.some((m) => m.month === newMonth.month)) {
              newMonths.unshift(newMonth);
            }
          }

          requestAnimationFrame(() => {
            if (calendarRef.current) {
              const scrollAmount =
                (calendarRef.current.scrollWidth / months.length) * 3;
              calendarRef.current.scrollLeft += scrollAmount;
            }
          });
        }

        isLoading.current = false;
        return newMonths;
      });
    });
  };

  const handleScroll = () => {
    if (!calendarRef.current || isLoading.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = calendarRef.current;
    if (scrollLeft <= 100) {
      loadMoreMonths("left");
    }

    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      loadMoreMonths("right");
    }
  };

  const scrollToToday = () => {
    const container = calendarRef.current;
    if (!container) return;

    const today = format(new Date(), "dd.MM.yyyy");
    const todayElement = container.querySelector(`[data-date='${today}']`);

    if (todayElement) {
      const offset = todayElement.offsetLeft - container.offsetLeft;

      container.scrollTo({
        left: offset - container.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  return {
    focusedDays,
    calendarRef,
    getTaskWidth,
    calculatedDays,
    handleScroll,
  }
}
