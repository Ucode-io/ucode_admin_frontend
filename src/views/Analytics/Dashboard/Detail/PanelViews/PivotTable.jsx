import { ResponsiveBar } from "@nivo/bar";
import styles from "./style.module.scss";

const PivotTable = ({ panel = {}, data = [] }) => {
  const chartAttributes = panel?.attributes?.["PIVOT_TABLE"] ?? {};
  console.log("data", data);
  return (
    <div className={styles.card}>
      <div className={styles.title}>{panel?.title}</div>
      <div className={styles.chartArea}></div>
    </div>
  );
};

export default PivotTable;
