import {Box} from "@mui/material";
import React from "react";
import styles from "./style.module.scss";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function TableUiHead() {
  return (
    <div className={styles.tableUiHead}>
      <Box sx={{display: "flex", gap: "6px", alignItems: "center"}}>
        <Box>
          <img src="/img/homeIcon.svg" alt="" />
        </Box>
        <Box sx={{height: "19px"}}>
          <KeyboardArrowRightIcon sx={{color: "#D0D5DD", height: "19px"}} />
        </Box>
        <Box sx={{fontWeight: 500, fontSize: "14px"}}>Покупки</Box>
        <Box sx={{height: "19px"}}>
          <KeyboardArrowRightIcon sx={{color: "#D0D5DD", height: "19px"}} />
        </Box>
        <Box sx={{color: "#337E28", fontWeight: 600}}>Контрагенты</Box>
      </Box>
    </div>
  );
}

export default TableUiHead;
