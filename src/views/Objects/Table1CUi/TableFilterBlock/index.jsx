import React from "react";
import styles from "./style.module.scss";
import {TextField} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function TableFilterBlock() {
  return (
    <div className={styles.tableFilterBlock}>
      <div className={styles.searchFilter}>
        <TextField
          sx={{
            width: "320px",
            height: "44px",
            "& .MuiInputBase-input": {
              padding: "12px 14px",
            },
          }}
          placeholder="Search"
          variant="outlined"
          size="small"
        />

        <button className={styles.filterBtn}>
          <FilterAltIcon />
        </button>
        <button className={styles.filterBtn}>
          <VisibilityOffIcon />
        </button>
      </div>

      <div className={styles.filterCreatBtns}>
        <button className={styles.createBtn}>Создать</button>
        <button className={styles.createGroupBtn}>Создать группу</button>
        <button className={styles.moreBtn}>
          <MoreVertIcon />
        </button>
      </div>
    </div>
  );
}

export default TableFilterBlock;
