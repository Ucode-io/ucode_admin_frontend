import { useEffect, useRef, useState } from "react";

export const useDateLineProps = () => {
  const [months, setMonths] = useState([]);
  const calendarRef = useRef(null);
  const isLoading = useRef(false);

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

    setTimeout(() => {
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
        } else {
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
        }
        return newMonths;
      });

      isLoading.current = false;
    }, 300);
  };

  useEffect(() => {
    const initialMonths = [];
    const currentDate = new Date();
    for (let i = -2; i <= 2; i++) {
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

  return {};
};

