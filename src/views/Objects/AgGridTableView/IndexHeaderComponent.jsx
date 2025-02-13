import React from "react";
import AddIcon from "@mui/icons-material/Add";
import style from "./style.module.scss";
import {Tooltip} from "@mui/material";
import {generateGUID} from "../../../utils/generateID";

function IndexHeaderComponent(props) {
  const {column} = props;
  const treeData = column?.colDef?.view?.attributes?.treeData;
  console.log("columncolumn", column, treeData);

  return (
    <Tooltip title="Add new row button">
      <button
        className={style.addRowBtn}
        onClick={() => {
          treeData
            ? column?.colDef?.addRow({
                guid: generateGUID(),
              })
            : column?.colDef?.appendNewRow();

          column?.colDef?.appendNewRow();
        }}>
        <AddIcon />
      </button>
    </Tooltip>
  );
}

export default IndexHeaderComponent;
