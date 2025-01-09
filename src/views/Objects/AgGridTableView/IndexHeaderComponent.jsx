import React from "react";
import AddIcon from "@mui/icons-material/Add";
import style from "./style.module.scss";
import {Tooltip} from "@mui/material";

function IndexHeaderComponent(props) {
  const {column} = props;
  // appendNewRow
  return (
    <Tooltip title="Add new row button">
      <button
        className={style.addRowBtn}
        onClick={() => column?.colDef?.appendNewRow()}>
        {/* Add row */}
        <AddIcon />
      </button>
    </Tooltip>
  );
}

export default IndexHeaderComponent;
