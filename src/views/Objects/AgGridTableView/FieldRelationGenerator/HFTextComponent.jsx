import {Box} from "@mui/material";
import React from "react";
import RowClickButton from "../RowClickButton";

function HFTextComponent(props) {
  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(props?.data);
  };
  return (
    <>
      {true ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            padding: "0 0 0 5px",
          }}>
          {props?.colDef?.label}
        </Box>
      ) : (
        <Box sx={{width: "100%", height: "100%"}}>
          <Box sx={{width: "100%", height: "29px"}}></Box>
          <Box sx={{width: "100%", fontWeight: "700", fontSize: "16px"}}>
            {props?.colDef?.label}
          </Box>
        </Box>
      )}

      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} />
      )}
    </>
  );
}

export default React.memo(HFTextComponent);
