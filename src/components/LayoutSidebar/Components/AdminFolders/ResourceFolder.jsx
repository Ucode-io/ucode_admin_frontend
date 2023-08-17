import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import "../../style.scss";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import Resources from "../Resources";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const resourceFolder = {
  label: "Resource",
  type: "USER_FOLDER",
  parent_id: adminId,
  id: "136",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const ResourceFolder = ({
  level = 1,
  menuStyle,
  menuItem,
  setSubMenuIsOpen,
}) => {
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);

  const activeStyle = {
    backgroundColor:
      resourceFolder?.id === menuItem?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      resourceFolder?.id === menuItem?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 * 5,
    display:
      menuItem?.id === "0" ||
      (menuItem?.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };
  const labelStyle = {
    color:
      resourceFolder?.id === menuItem?.id
        ? menuStyle?.active_text
        : menuStyle?.text,
  };

  const clickHandler = (e) => {
    dispatch(menuActions.setMenuItem(resourceFolder));
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
            {resourceFolder.label}
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
          <Resources
            menuStyle={menuStyle}
            setSubMenuIsOpen={setSubMenuIsOpen}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default ResourceFolder;
