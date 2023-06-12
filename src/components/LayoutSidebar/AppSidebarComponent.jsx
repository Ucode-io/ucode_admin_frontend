import { Box, ListItemButton, ListItemText, Tooltip } from "@mui/material";
import { useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { Draggable } from "react-smooth-dnd";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import "./style.scss";
import IconGenerator from "../IconPicker/IconGenerator";

const AppSidebar = ({
  index,
  element,
  sidebarIsOpen,
  setElement,
  setSubMenuIsOpen,
  subMenuIsOpen,
  handleOpenNotify,
  setSelectedApp,
}) => {
  const { appId } = useParams();
  const navigate = useNavigate();

  const clickHandler = () => {
    setElement(element);
    setSelectedApp(element);
    setSubMenuIsOpen(true);
    navigate(`/main/${element.id}`);
  };

  useEffect(() => {
    setElement(element);
  }, [element]);

  return (
    <Draggable key={index}>
      <ListItemButton
        key={index}
        onClick={() => {
          clickHandler();
        }}
        className="parent-folder column-drag-handle"
        style={{
          background: appId === element.id && subMenuIsOpen ? "#007AFF" : "",
          color: appId === element.id && subMenuIsOpen ? "#fff" : "",
        }}
      >
        <IconGenerator icon={element?.icon} size={18} className="folder-icon" />
        {sidebarIsOpen && <ListItemText primary={element?.label} />}
        {sidebarIsOpen && (
          <>
            <Tooltip title="Folder settings" placement="top">
              <Box className="extra_icon">
                <BsThreeDots
                  size={13}
                  onClick={(e) => {
                    handleOpenNotify(e, "FOLDER");
                  }}
                />
              </Box>
            </Tooltip>
            <Tooltip title="Create folder" placement="top">
              <Box
                className="extra_icon"
                onClick={(e) => {
                  handleOpenNotify(e, "CREATE_TO_FOLDER");
                }}
              >
                <AddIcon size={13} />
              </Box>
            </Tooltip>
          </>
        )}
        {sidebarIsOpen && <KeyboardArrowRightIcon />}
      </ListItemButton>
    </Draggable>
  );
};

export default AppSidebar;
