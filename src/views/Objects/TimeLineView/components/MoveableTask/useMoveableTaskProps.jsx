import { eachDayOfInterval, format, isValid, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import cls from "./styles.module.scss"; 

function getOffsetForDate(dateStr, months, dayWidth) {
  let totalDays = 0;

  for (const month of months) {
    for (const day of month.days) {
      const [d, weekday] = day.split('/');
      const current = new Date(`${month.month} ${d}`);
      const currentStr = current.toISOString().slice(0, 10);
      if (currentStr === dateStr) return totalDays * dayWidth;
      totalDays++;
    }
  }

  return 0;
}

const getDaysBetween = (start, end) => {
  const startDate = typeof start === "string" ? parseISO(end) : new Date(end);
  const endDate = typeof end === "string" ? parseISO(start) : new Date(start);

  if (!isValid(startDate) || !isValid(endDate)) {
    console.error("Invalid start or end date:", { start, end });
    return [];
  }

  if (startDate > endDate) {
    console.error("Start date is after end date");
    return [];
  }

  return eachDayOfInterval({ start: startDate, end: endDate }).map(date =>
    format(date, "yyyy-MM-dd")
  );
};


export const useMoveableTaskProps = ({dayWidth, months, task, rowIndex}) => {

  const ref = useRef();
  const [frame, setFrame] = useState({
    translate: [0, 0],
    width: getDaysBetween(task?.end_date, task?.start_date).length * dayWidth, // начальная ширина
  });

  const taskRef = useRef(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains(cls.resizeHandle)) {
      isResizing.current = true;
    } else {
      isDragging.current = true;
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const newX = e.clientX - taskRef.current.getBoundingClientRect().left;
      // Перемещаем с шагом в 32px
      setFrame((prevFrame) => ({
        ...prevFrame,
        translate: [Math.round(newX / 32) * 32, prevFrame.translate[1]],
      }));
    } else if (isResizing.current) {
      const newWidth = e.clientX - taskRef.current.getBoundingClientRect().left;
      // Ограничиваем минимальную ширину в 32px
      setFrame((prevFrame) => ({
        ...prevFrame,
        width: Math.max(newWidth, 32),
      }));
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    isResizing.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    isResizing.current = false;
  };

  useEffect(() => {
    // Вычисляем смещение от начала таймлайна
    const offset = getOffsetForDate(task.start_date, months, dayWidth);
    setFrame((prev) => ({
      ...prev,
      translate: [offset, rowIndex * 60], // top по строке
    }));
  }, [task.start_date, months]);

  return {
    ref,
    frame,
    setFrame,
    taskRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  }
}
