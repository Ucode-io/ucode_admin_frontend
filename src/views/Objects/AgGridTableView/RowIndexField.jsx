import {Box, Button, Checkbox} from "@mui/material";
import React from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

function RowIndexField(props) {
  const {value, node, api, column} = props;
  const treeData = column?.colDef?.view?.attributes?.treeData;
  const isSelected = node?.isSelected();

  const toggleRowSelection = () => {
    if (!api || !node) return;
    node.setSelected(!isSelected);
  };

  const elementsLength = node?.parent?.allChildrenCount;
  const elementIndex = node?.childIndex;

  return (
    <>
      <Box className={isSelected ? "rowIndexSelected" : "rowIndex"}>
        <Button className="editButton" style={{minWidth: "max-content"}}>
          <Checkbox
            checked={node.isSelected()}
            onChange={toggleRowSelection}
            style={{width: "16px", height: "16px"}}
          />
        </Button>
        <Box className="indexValue">{value}</Box>
      </Box>
      {elementsLength - 1 === elementIndex && !isSelected && (
        <Box
          onClick={() => {
            treeData
              ? column?.colDef?.addRow({
                  guid: generateGUID(),
                })
              : column?.colDef?.appendNewRow();
          }}
          className="add_row_btn">
          <AddRoundedIcon style={{color: "#007AFE"}} />
        </Box>
      )}
    </>
  );
}

export default RowIndexField;
