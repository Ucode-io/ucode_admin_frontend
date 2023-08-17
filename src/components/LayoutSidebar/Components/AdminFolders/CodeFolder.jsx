import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import "../../style.scss";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import ScenarioSidebar from "../Scenario/ScenarioSidebar";
import DocumentsSidebar from "../Documents/DocumentsSidebar";
import EmailSidebar from "../Email/EmailSidebar";
import ProjectSettingSidebar from "../Project/ProjectSettingSidebar";
import FunctionSidebar from "../Functions/FunctionSIdebar";
import NotificationSidebar from "../Notification/NotificationSidebar";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const adminFolder = {
  label: "Code",
  type: "USER_FOLDER",
  parent_id: adminId,
  id: "135",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const CodeFolder = ({ level = 1, menuStyle, menuItem, setSubMenuIsOpen }) => {
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);

  const activeStyle = {
    backgroundColor:
      adminFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      adminFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 * 5,
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };
  const labelStyle = {
    color:
      adminFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };

  const clickHandler = (e) => {
    dispatch(menuActions.setMenuItem(adminFolder));
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={activeStyle}
          className="nav-element"
          onClick={(e) => {
            clickHandler(e);
          }}
        >
          <div className="label" style={labelStyle}>
            <IconGenerator icon={"code.svg"} size={18} />
            Code
          </div>
          {childBlockVisible ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        <Box
          style={{
            marginLeft: "10px",
          }}
        >
          <ScenarioSidebar
            menuStyle={menuStyle}
            setSubMenuIsOpen={setSubMenuIsOpen}
            menuItem={menuItem}
          />
          <DocumentsSidebar
            menuStyle={menuStyle}
            setSubMenuIsOpen={setSubMenuIsOpen}
            menuItem={menuItem}
          />
          <EmailSidebar menuStyle={menuStyle} menuItem={menuItem} />
          <ProjectSettingSidebar menuStyle={menuStyle} menuItem={menuItem} />
          <FunctionSidebar
            menuStyle={menuStyle}
            setSubMenuIsOpen={setSubMenuIsOpen}
            menuItem={menuItem}
          />
          <NotificationSidebar
            menuStyle={menuStyle}
            setSubMenuIsOpen={setSubMenuIsOpen}
            menuItem={menuItem}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default CodeFolder;
