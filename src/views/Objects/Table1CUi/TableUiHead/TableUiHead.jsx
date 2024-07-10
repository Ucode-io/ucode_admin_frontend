import {Box} from "@mui/material";
import React, {useState} from "react";
import styles from "./style.module.scss";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {useMenuGetByIdQuery} from "../../../../services/menuService";
import {useParams} from "react-router-dom";

function TableUiHead({menuItem}) {
  const {appId} = useParams();
  const [parentMenu, setParentMenu] = useState();

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: appId,
    queryParams: {
      enabled: Boolean(appId),
      onSuccess: (res) => {
        setParentMenu(res);
      },
    },
  });

  console.log("parentMenuparentMenu", parentMenu);
  return (
    <div className={styles.tableUiHead}>
      <Box sx={{display: "flex", gap: "6px", alignItems: "center"}}>
        <Box>
          <img src="/img/homeIcon.svg" alt="" />
        </Box>
        <Box sx={{height: "19px"}}>
          <KeyboardArrowRightIcon sx={{color: "#D0D5DD", height: "19px"}} />
        </Box>
        <Box sx={{fontWeight: 500, fontSize: "12px"}}>{parentMenu?.label}</Box>
        <Box sx={{height: "19px"}}>
          <KeyboardArrowRightIcon sx={{color: "#D0D5DD", height: "19px"}} />
        </Box>
        <Box sx={{color: "#337E28", fontWeight: 600, fontSize: "12px"}}>
          {menuItem?.label ?? ""}
        </Box>
      </Box>
    </div>
  );
}

export default TableUiHead;
