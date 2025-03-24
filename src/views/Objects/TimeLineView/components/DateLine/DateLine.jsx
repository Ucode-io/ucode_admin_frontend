import styles from "./styles.module.scss";
import { useDateLineProps } from "./useDateLineProps";

export const DateLine = () => {

  const props = useDateLineProps();

  return <div
    className={styles.datesRow}
    style={{
      borderRight: "1px solid #e0e0e0",
      position: "sticky",
      left: 0,
      top: 0,
      background: "#fff",
      zIndex: 4,
    }}
  >
    
  </div>
};
