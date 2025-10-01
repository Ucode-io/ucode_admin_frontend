import {useEffect, useRef, useState} from "react";
import useDebounce from "@/hooks/useDebounce";
import {useTranslation} from "react-i18next";
import styles from "./style.module.scss";

const quarters = ["Q1", "Q2", "Q3", "Q4"];
const currentYear = new Date().getFullYear();
const currentQuarter = `Q${Math.floor(new Date().getMonth() / 3) + 1}`;
const years = Array.from({length: 20}, (_, i) => currentYear - 10 + i);

const getQuarterIndex = (year, quarter) => {
  return (year - years[0]) * 4 + quarters.indexOf(quarter);
};

const getQuarterRange = (year, quarter) => {
  const startMonth = quarters.indexOf(quarter) * 3;
  const start = new Date(year, startMonth, 1, 0, 0, 0);
  const end = new Date(year, startMonth + 3, 0, 23, 59, 59);
  return [start, end];
};

const parseTimeFromString = (value, fallbackHours, fallbackMinutes) => {
  if (!value) return {hours: fallbackHours, minutes: fallbackMinutes};
  const [hours, minutes] = value.split(":");
  return {hours: Number(hours), minutes: Number(minutes)};
};

const YQuarterPicker = ({onChange, withTime = false, value}) => {
  const quarterRefs = useRef({});
  const {i18n} = useTranslation();
  const [range, setRange] = useState([]);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [hoveredQuarter, setHoveredQuarter] = useState(null);

  const handleQuarterClick = (year, quarter) => {
    if (range.length === 0 || range.length === 2) {
      setRange([{year, quarter}]);
    } else {
      const start = range[0];
      const startIndex = getQuarterIndex(start.year, start.quarter);
      const endIndex = getQuarterIndex(year, quarter);
      if (endIndex >= startIndex) {
        setRange([start, {year, quarter}]);
      } else {
        setRange([{year, quarter}]);
      }
    }
  };

  const applyChange = () => {
    if (range.length !== 2) return;
    const [startMeta, endMeta] = range;
    const [start, end] = getQuarterRange(endMeta.year, endMeta.quarter);
    const [realStart, _] = getQuarterRange(startMeta.year, startMeta.quarter);

    if (withTime) {
      const sTime = parseTimeFromString(startTime, 0, 0);
      const eTime = parseTimeFromString(endTime, 23, 59);
      realStart.setHours(sTime.hours, sTime.minutes, 0);
      end.setHours(eTime.hours, eTime.minutes, 59);
    }

    onChange({$gte: realStart, $lt: end});
  };

  const handleTimeChange = useDebounce(() => {
    applyChange();
  }, 400);

  useEffect(() => {
    if (range.length === 2) {
      applyChange();
    }
  }, [range]);

  useEffect(() => {
    handleTimeChange();
  }, [startTime, endTime]);

  useEffect(() => {
    if (value?.$gte && value?.$lt) {
      const start = new Date(value.$gte);
      const end = new Date(value.$lt);

      const startQ = `Q${Math.floor(start.getMonth() / 3) + 1}`;
      const endQ = `Q${Math.floor(end.getMonth() / 3) + 1}`;

      setRange([
        {year: start.getFullYear(), quarter: startQ},
        {year: end.getFullYear(), quarter: endQ},
      ]);
    } else {
      setRange([{year: currentYear, quarter: currentQuarter}]);
    }
  }, []);

  const isQuarterStart = (year, quarter) =>
    range[0] && range[0].year === year && range[0].quarter === quarter;

  const isQuarterEnd = (year, quarter) =>
    range[1] && range[1].year === year && range[1].quarter === quarter;

  const isQuarterInMiddle = (year, quarter) => {
    if (range.length !== 2) return false;
    const index = getQuarterIndex(year, quarter);
    const start = getQuarterIndex(range[0].year, range[0].quarter);
    const end = getQuarterIndex(range[1].year, range[1].quarter);
    return index > start && index < end;
  };

  const isQuarterHoveredInRange = (year, quarter) => {
    if (range.length !== 1 || !hoveredQuarter) return false;
    const start = getQuarterIndex(range[0].year, range[0].quarter);
    const end = getQuarterIndex(hoveredQuarter.year, hoveredQuarter.quarter);
    const index = getQuarterIndex(year, quarter);
    return (start <= index && index <= end) || (end <= index && index <= start);
  };

  useEffect(() => {
    if (range.length > 0) {
      const {year, quarter} = range[0];
      const key = `${year}-${quarter}`;
      const node = quarterRefs.current[key];
      if (node && typeof node.scrollIntoView === "function") {
        node.scrollIntoView({behavior: "smooth", block: "center"});
      }
    }
  }, [range]);

  return (
    <div className={styles.wrapper}>
      {years.map((year) => (
        <div key={year} className={styles.row}>
          <div className={styles.year}>{year}</div>
          {quarters.map((qtr) => {
            const isStart = isQuarterStart(year, qtr);
            const isEnd = isQuarterEnd(year, qtr);
            const isMiddle = isQuarterInMiddle(year, qtr);

            return (
              <button
                ref={(el) => {
                  const key = `${year}-${qtr}`;
                  quarterRefs.current[key] = el;
                }}
                key={qtr}
                className={`${styles.quarterButton} 
                  ${isStart ? styles.startQuarter : ""}
                  ${isEnd ? styles.endQuarter : ""}
                  ${isMiddle ? styles.inRange : ""}
                  ${isQuarterHoveredInRange(year, qtr) ? styles.hoveredRange : ""}`}
                onClick={() => handleQuarterClick(year, qtr)}
                onMouseEnter={() => {
                  if (range.length === 1) {
                    setHoveredQuarter({year, quarter: qtr});
                  }
                }}
                onMouseLeave={() => {
                  setHoveredQuarter(null);
                }}>
                {qtr}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default YQuarterPicker;
