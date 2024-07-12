import React from "react";
import styles from "./style.module.scss";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function TableHeadTitle() {
  return (
    <div className={styles.tableHeadTitle}>
      <h2>Контрагенты</h2>
      <div className={styles.tableHeadLinks}>
        {/* <a href="#">
          Счета расходов с контрагентами <OpenInNewIcon />
        </a>
        <a href="#">
          Номенклатура поставщика <OpenInNewIcon />
        </a> */}
      </div>
    </div>
  );
}

export default TableHeadTitle;
