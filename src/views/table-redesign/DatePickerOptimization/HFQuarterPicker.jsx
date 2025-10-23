import {useRef, useState, useEffect} from "react";
import styles from "./style.module.scss";

const quarters = ["Q1", "Q2", "Q3", "Q4"];
const currentYear = new Date().getFullYear();
const currentQuarter = `Q${Math.floor(new Date().getMonth() / 3) + 1}`;
const years = Array.from({length: 20}, (_, i) => currentYear - 10 + i);

const HFQuarterPicker = ({
  onChange,
  value,
}) => {
  const quarterRefs = useRef({});

  const [selected, setSelected] = useState(() => {
    if (value) {
      const date = new Date(value);
      return {
        year: date.getFullYear(),
        quarter: `Q${Math.floor(date.getMonth() / 3) + 1}`,
      };
    }
    return {year: currentYear, quarter: currentQuarter};
  });

  useEffect(() => {
    const {year, quarter} = selected;
    const month = quarters.indexOf(quarter) * 3;
    const date = new Date(year, month, 1, 0, 0, 0);
    onChange(date);
  }, [selected]);

  useEffect(() => {
    const key = `${selected.year}-${selected.quarter}`;
    const node = quarterRefs.current[key];
    if (node?.scrollIntoView) {
      node.scrollIntoView({behavior: "smooth", block: "center"});
    }
  }, [selected]);

  return (
    <div className={styles.wrapper}>
      {years.map((year) => (
        <div key={year} className={styles.row}>
          <div className={styles.year}>{year}</div>
          {quarters.map((qtr) => {
            const isSelected =
              selected.year === year && selected.quarter === qtr;

            return (
              <button
                ref={(el) => {
                  quarterRefs.current[`${year}-${qtr}`] = el;
                }}
                key={qtr}
                className={`${styles.quarterButton} ${
                  isSelected ? styles.selectedQuarter : ""
                }`}
                onClick={() => setSelected({year, quarter: qtr})}>
                {qtr}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default HFQuarterPicker;
