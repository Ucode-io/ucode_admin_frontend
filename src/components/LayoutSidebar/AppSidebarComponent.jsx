import {
  Box,
  Divider,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
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
  selectedApp,
}) => {
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
      setSubMenuIsOpen(false);
      navigate(`/main/${element?.id}/object/${element?.data?.table?.slug}`);
    } else if (element.type === "MICROFRONTEND") {
      navigate(`/main/${element?.id}/page/${element?.data?.microfrontend?.id}`);
      setSubMenuIsOpen(false);
    } else if (element.type === "WEBPAGE") {
      navigate(`/main/${element?.id}/web-page/${element?.data?.webpage?.id}`);
      setSubMenuIsOpen(false);
      window.location.reload();
    }
  };
  const favourite = element?.id === "c57eedc3-a954-4262-a0af-376c65b5a282";

  useEffect(() => {
    setElement(element);
  }, [element]);
  return (
    <Draggable key={index}>
      {element?.data?.permission?.read && (
              <ListItemButton
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                clickHandler();
              }}
              className="parent-folder column-drag-handle"
              style={{
                background: selectedApp?.id === element.id ? "#007AFF" : "",
                color: selectedApp?.id === element.id ? "#fff" : "#A8A8A8",
                borderTop: favourite && "1px solid #F0F0F0",
                borderBottom: favourite && "1px solid #F0F0F0",
                padding: favourite && "18px 12px",
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
                 {element?.data?.permission?.create && (
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
                 )}
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
                />
              )}
              {element?.type === "MICROFRONTEND" && (
                <MenuIcon
                  title="Microfrontend settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenNotify(e, "MICROFRONTEND");
                    setElement(element);
                  }}
                />
              )}
              {element?.type === "WEBPAGE" && (
                <MenuIcon
                  title="Webpage settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenNotify(e, "WEBPAGE");
                    setElement(element);
                  }}
                />
              )}
              {sidebarIsOpen && element?.type === "FOLDER" ? (
                <KeyboardArrowRightIcon />
              ) : (
                ""
              )}
            </ListItemButton>
      )}
    </Draggable>
  );
};

export default AppSidebar;
