import React from "react";
import styles from "./style.module.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function FormPageHead() {
  return (
    <div className={styles.tableHeadTitle}>
      <h2>Контрагенты</h2>
      <div className={styles.tableHeadLinks}>
        <button className={styles.headRegisterClose}>Записать и закрыть</button>
        <button className={styles.headRegister}>Записать</button>
        <button className={styles.headMore}>
          <MoreVertIcon />
        </button>
      </div>
    </div>
  );
}

export default FormPageHead;
