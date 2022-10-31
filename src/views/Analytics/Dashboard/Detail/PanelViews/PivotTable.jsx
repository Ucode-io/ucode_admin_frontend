import React, { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./style.module.scss";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";

const PivotTable = ({ panel = {}, data = [] }) => {
  const [pivotData, setPivotData] = useState({});

  const chartAttributes = panel?.attributes?.["PIVOT_TABLE"] ?? {};
  console.log("dataaaaa", data);
  return (
    <div className={styles.card}>
      {/* <div className={styles.title}>{panel?.title}</div> */}
      <PivotTableUI
        id="pivot"
        data={data}
        onChange={(s) => setPivotData(s)}
        aggregatorName="Integer Sum"
        // cols={[""]}
        // rows={[""]}
        vals={["amount"]}
        {...pivotData}
        hiddenAttributes={[
          "pvtRenderers",
          "pvtAxisContainer",
          "pvtVals",
          "pvtAxisContainer",
        ]}
        hiddenFromAggregators={["id", "companyid"]}
      />
      {/* <div className={styles.chartArea}></div> */}
    </div>
  );
};

export default PivotTable;
