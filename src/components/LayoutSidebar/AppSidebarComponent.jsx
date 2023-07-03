import { Box, ListItemButton, ListItemText, Tooltip } from "@mui/material";
import { useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { Draggable } from "react-smooth-dnd";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import "./style.scss";
import IconGenerator from "../IconPicker/IconGenerator";
import { useDispatch } from "react-redux";
import { menuActions } from "../../store/menuItem/menuItem.slice";
import MenuIcon from "./MenuIcon";

const AppSidebar = ({
  index,
  element,
  sidebarIsOpen,
  setElement,
  setSubMenuIsOpen,
  handleOpenNotify,
  setSelectedApp,
  environment,
  selectedApp,
}) => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clickHandler = () => {
    dispatch(menuActions.setMenuItem(element));
    setSelectedApp(element);
    if (element.type === "FOLDER") {
      setElement(element);
      setSubMenuIsOpen(true);
      navigate(`/main/${element.id}`);
    } else if (element.type === "TABLE") {
      navigate(`/main/${appId}/object/${element?.data?.table?.slug}`);
      setSubMenuIsOpen(false);
    } else if (element.type === "MICROFRONTEND") {
      navigate(`/main/${appId}/page/${element?.data?.microfrontend?.id}`);
      setSubMenuIsOpen(false);
    } else if (element.type === "WEBPAGE") {
      navigate(`/main/${appId}/web-page/${element?.data?.webpage?.id}`);
      setSubMenuIsOpen(false);
    }
  };

  useEffect(() => {
    setElement(element);
  }, [element]);

  return (
    <Draggable key={index}>
      <ListItemButton
        key={index}
        onClick={(e) => {
          e.stopPropagation();
          clickHandler();
        }}
        className="parent-folder column-drag-handle"
        style={{
          background: selectedApp?.id === element.id ? "#007AFF" : "",
          color: selectedApp?.id === element.id ? "#fff" : "",
        }}
      >
        <IconGenerator
          icon={
            element?.icon ||
            element?.data?.microfrontend?.icon ||
            element?.data?.webpage?.icon ||
            "folder.svg"
          }
          size={18}
          className="folder-icon"
        />
        {sidebarIsOpen && (
          <ListItemText
            primary={
              element?.label ||
              element?.data?.microfrontend?.name ||
              element?.data?.webpage?.title
            }
          />
        )}
        {element?.type === "FOLDER" && sidebarIsOpen ? (
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
        ) : (
          ""
        )}
        {element?.type === "TABLE" && (
          <MenuIcon
            title="Table settings"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenNotify(e, "TABLE");
              setElement(element);
            }}
            style={{
              color:
                selectedApp?.id === element?.id
                  ? environment?.data?.active_color
                  : environment?.data?.color,
            }}
          />
        )}
        {sidebarIsOpen && element?.type === "FOLDER" ? (
          <KeyboardArrowRightIcon />
        ) : (
          ""
        )}
      </ListItemButton>
    </Draggable>
  );
};

export default AppSidebar;
