import React from "react";
import AddIcon from "@mui/icons-material/Add";
import style from "./style.module.scss";

function IndexHeaderComponent(props) {
  const {column} = props;
  return (
    <div>
      <button
        className={style.addRowBtn}
        onClick={() => column?.colDef?.addRow()}>
        {/* Add row */}
        <AddIcon />
      </button>
    </div>
  );
}

export default IndexHeaderComponent;
