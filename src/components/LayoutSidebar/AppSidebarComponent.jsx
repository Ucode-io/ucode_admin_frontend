import {
  Box,
  Button,
  IconButton,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Draggable } from "react-smooth-dnd";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import "./style.scss";
import menuSettingsService from "../../services/menuSettingsService";
import IconGenerator from "../IconPicker/IconGenerator";
import ButtonsMenu from "./MenuButtons";

const AppSidebar = ({
  index,
  element,
  parentClickHandler,
  openFolderCreateModal,
  environment,
  setFolderModalType,
  setSelectedTable,
  level = 1,
  sidebarIsOpen,
  getMenuList,
  setTableModal,
  setElement,
  setSubMenuIsOpen,
  subMenuIsOpen,
  setMicrofrontendModal,
}) => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState();
  const [menuType, setMenuType] = useState();
  const openMenu = Boolean(menu);
  const queryClient = useQueryClient();

  const clickHandler = () => {
    element.type === "TABLE" && parentClickHandler(element);
    setElement(element);
    setSubMenuIsOpen(true);
    navigate(`/main/${element.id}`);
  };

  useEffect(() => {
    if (element?.id === appId) {
      setElement(element);
    }
  }, [appId, element]);

  const handleOpenNotify = (event, type) => {
    setMenu(event?.currentTarget);
    setMenuType(type);
  };
  const handleCloseNotify = () => {
    setMenu(null);
  };

  const deleteFolder = (element) => {
    menuSettingsService
      .delete(element.id)
      .then(() => {
        queryClient.refetchQueries(["MENU"], element?.id);
        getMenuList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Draggable key={index}>
      <ListItemButton
        key={index}
        onClick={() => {
          clickHandler();
        }}
        className="parent-folder"
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
        <ButtonsMenu
          element={element}
          menu={menu}
          openMenu={openMenu}
          handleCloseNotify={handleCloseNotify}
          sidebarIsOpen={sidebarIsOpen}
          openFolderCreateModal={openFolderCreateModal}
          deleteFolder={deleteFolder}
          menuType={menuType}
          setFolderModalType={setFolderModalType}
          setSelectedTable={setSelectedTable}
          appId={appId}
          setTableModal={setTableModal}
          setMicrofrontendModal={setMicrofrontendModal}
        />
      </ListItemButton>
    </Draggable>
  );
};

export default AppSidebar;
