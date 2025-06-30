import {Box, Button, Checkbox} from "@mui/material";
import React from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {generateGUID} from "../../../utils/generateID";

function RowIndexField(props) {
  const {value, node, api, column, colDef, data} = props;
  const treeData = column?.colDef?.view?.attributes?.treeData;
  const isSelected = node?.isSelected();
  const view = colDef?.view;
  const toggleRowSelection = () => {
    if (!api || !node) return;
    node.setSelected(!isSelected);
  };

  const elementsLength = node?.parent?.allChildrenCount;
  const elementIndex = node?.childIndex;

  return (
    <>
      <Box className={isSelected ? "rowIndexSelected" : "rowIndex"}>
        {view?.attributes?.treeData ? (
          <Button
            onClick={() => {
              colDef?.createChildTree(props);
            }}
            className="editButton"
            style={{minWidth: "max-content"}}>
            <AddRoundedIcon style={{color: "#007AFE"}} />
          </Button>
        ) : (
          <Button className="editButton" style={{minWidth: "max-content"}}>
            <Checkbox
              checked={node.isSelected()}
              onChange={toggleRowSelection}
              style={{width: "16px", height: "16px"}}
            />
          </Button>
        )}
        <Box className="indexValue">{value}</Box>
      </Box>
      {!view?.attributes?.treeData &&
        elementsLength - 1 === elementIndex &&
        !isSelected && (
          <Box
            onClick={() => {
              column?.colDef?.addRow({
                guid: generateGUID(),
              });
            }}
            className="add_row_btn">
            <AddRoundedIcon style={{color: "#007AFE"}} />
          </Box>
        )}
    </>
  );
}

export default RowIndexField;
