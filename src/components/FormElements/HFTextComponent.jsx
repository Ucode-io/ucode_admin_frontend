import {Box} from "@mui/material";
import React from "react";

function HFTextComponent({field = {}, isTableView = false}) {
  return (
    <>
      {isTableView ? (
        <Box sx={{width: "100%", height: "100%", padding: "0 0 0 15px"}}>
          {field?.label}
        </Box>
      ) : (
        <Box sx={{width: "100%", height: "100%"}}>
          <Box sx={{width: "100%", height: "29px"}}></Box>
          <Box sx={{width: "100%", fontWeight: "700", fontSize: "16px"}}>
            {field?.label}
          </Box>
        </Box>
      )}
    </>
  );
}

export default HFTextComponent;
