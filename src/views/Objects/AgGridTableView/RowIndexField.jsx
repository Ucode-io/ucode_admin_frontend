import {Box, Button, Checkbox} from "@mui/material";
import React from "react";

function RowIndexField(props) {
  const {value, node, api} = props;

  const isSelected = node?.isSelected();

  const toggleRowSelection = () => {
    if (!api || !node) return;
    node.setSelected(!isSelected);
  };
  return (
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
  );
}

export default RowIndexField;
