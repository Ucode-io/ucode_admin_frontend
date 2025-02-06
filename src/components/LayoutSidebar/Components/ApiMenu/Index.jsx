import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {Box, Button, Collapse, Tooltip} from "@mui/material";
import React, {useState} from "react";
import IconGenerator from "../../../IconPicker/IconGenerator";
import AddIcon from "@mui/icons-material/Add";
import activeStyles from "../MenuUtils/activeStyles";
import {useDispatch, useSelector} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import ApiKeyButton from "../ApiKey/ApiKeyButton";
import RedirectButton from "../Redirect/RedirectButton";
// import RecursiveBlock from "./RecursiveBlock";

export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;
const projectSettings = {
  label: "API",
  type: "USER_FOLDER",
  icon: "lock.svg",
  parent_id: adminId,
  id: "23233",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

function ApiMenu({level = 1, menuStyle}) {
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const menuItem = useSelector((state) => state.menu.menuItem);
  const dispatch = useDispatch();

  const clickHandler = (e) => {
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
    dispatch(menuActions.setMenuItem(projectSettings));
  };

  return (
    <Box sx={{padding: "0 5px"}}>
      <div
        className="parent-block column-drag-handle"
        style={{marginBottom: 5}}>
        <Button
          style={menuStyle}
          className="nav-element highlight-on-hover"
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label">
            {childBlockVisible ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
            <IconGenerator icon={"lock.svg"} size={18} />
            API
          </div>
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        <ApiKeyButton menuStyle={menuStyle} menuItem={menuItem} level={2} />
        <RedirectButton menuStyle={menuStyle} menuItem={menuItem} level={2} />
      </Collapse>
    </Box>
  );
}

export default ApiMenu;
