import { useEffect, useRef, useState } from "react";

export const useDateLineProps = () => {

  const [months, setMonths] = useState([]);
  const calendarRef = useRef(null);
  const isLoading = useRef(false);

  const generateMonth = (monthIndex, year) => {
    const date = new Date(year, monthIndex, 1);
    const days = [];
    while (date.getMonth() === monthIndex) {
      const day = new Date(date);
      const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
      days.push(`${day.getDate()}/${dayName}`);
      date.setDate(date.getDate() + 1);
    }
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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

        if (direction === 'right') {
          const [monthName, year] = lastMonth.month.split(' ');
          const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
          newMonths.push(generateMonth((monthIndex + 1) % 12, parseInt(year) + (monthIndex === 11 ? 1 : 0)));
        } else {
          const [monthName, year] = firstMonth.month.split(' ');
          const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
          newMonths.unshift(generateMonth((monthIndex - 1 + 12) % 12, parseInt(year) - (monthIndex === 0 ? 1 : 0)));
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
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      initialMonths.push(generateMonth(date.getMonth(), date.getFullYear()));
    }
    setMonths(initialMonths);
  }, []);

  const handleScroll = () => {
    if (!calendarRef.current || isLoading.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = calendarRef.current;
    if (scrollLeft <= 100) {
      loadMoreMonths('left');
    }

    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      loadMoreMonths('right');
    }
  };

  const scrollToMonth = (monthName) => {
    const monthIndex = months.findIndex(m => m.month === monthName);
    if (monthIndex !== -1 && calendarRef.current) {
      const monthElement = calendarRef.current.children[monthIndex];
      if (monthElement) {
        monthElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }
  };

  return {
  };
};

