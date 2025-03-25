import {Button} from "@mui/material";
import React from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

function RowClickButton({onRowClick = () => {}, api, right = "5px"}) {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={"rowClickButton"}
      style={{
        minWidth: "max-content",
        right: right,
      }}>
      <OpenInFullIcon style={{width: "14px", height: "19px"}} />
    </Button>
  );
}

export default RowClickButton;
