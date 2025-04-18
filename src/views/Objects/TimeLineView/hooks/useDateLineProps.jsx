import { add, differenceInDays } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";

export const useDateLineProps = ({ setCenterDate = () => {} }) => {
  const [months, setMonths] = useState([]);
  const calendarRef = useRef(null);
  const isLoading = useRef(false);

  let firstDate = null;
  let lastDate = null;

  if (months.length > 0) {
    const [firstMonthName, firstYear] = months[0].month.split(" ");
    const [lastMonthName, lastYear] =
      months[months.length - 1].month.split(" ");

    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    firstDate = new Date(Number(firstYear), monthMap[firstMonthName], 1);
    lastDate = new Date(Number(lastYear), monthMap[lastMonthName] + 1, 0);
  }

  const datesList = useMemo(() => {
    const differenceDays = differenceInDays(lastDate, firstDate);

    const result = [];
    for (let i = 0; i <= differenceDays; i++) {
      result.push(add(firstDate, { days: i }));
    }
    return result;
  }, [lastDate, firstDate]);

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

  useEffect(() => {
    const initialMonths = [];
    const currentDate = new Date();
    for (let i = -3; i <= 3; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      );
      const newMonth = generateMonth(date.getMonth(), date.getFullYear());
      if (!initialMonths.some((m) => m.month === newMonth.month)) {
        initialMonths.push(newMonth);
      }
    }
    setMonths(initialMonths);
  }, []);

  const scrollToMonth = (monthName) => {
    if (!calendarRef.current) return;
    const cards = calendarRef.current.querySelectorAll(".month-card");
    cards.forEach((card) => {
      if (card.dataset.month === monthName) {
        card.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
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

    // const timelineDays = calendarRef.current.querySelector("#timelineDays");

    // const rect = calendarRef.current.getBoundingClientRect();
    // const centerX = rect.left + rect.width / 2;
    // const centerY = rect.top + rect.height / 2;

    // const visibleCenter = document.elementFromPoint(centerX, centerY);

    const scrollable = calendarRef.current;

    const leftScroll = scrollable.scrollLeft;
    const visibleCenterX = leftScroll + scrollable.clientWidth / 2;

    const centerIndex = Math.floor(visibleCenterX / 60);
    setCenterDate(datesList[centerIndex]);
  };

  return {
    handleScroll,
    scrollToMonth,
    calendarRef,
    months,
    setMonths,
    firstDate,
    lastDate,
    datesList,
  };
};
