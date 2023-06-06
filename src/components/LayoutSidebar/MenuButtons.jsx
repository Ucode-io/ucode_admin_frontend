import { Box, Divider, Menu, MenuItem } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import "./style.scss";
import { BsFillTrashFill } from "react-icons/bs";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import TableChartIcon from "@mui/icons-material/TableChart";
import { useNavigate } from "react-router-dom";
import MenuItemComponent from "./MenuItem";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";

const ButtonsMenu = ({
  element,
  menu,
  openMenu,
  handleCloseNotify,
  openFolderCreateModal,
  deleteFolder,
  menuType,
  setFolderModalType,
  setSelectedTable,
  appId,
  setTableModal,
  setMicrofrontendModal,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <Menu
        anchorEl={menu}
        open={openMenu}
        onClose={handleCloseNotify}
        PaperProps={{
          elevation: 0,
          sx: {
            width: "17%",
            overflow: "visible",
            filter: "drop-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important",
            mt: 1.5,
            padding: "5px",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        key={element?.id}
      >
        {menuType === "FOLDER" ? (
          <Box className="menu">
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Изменить папку"
              onClick={(e) => {
                e.stopPropagation();
                openFolderCreateModal("update", element);
                handleCloseNotify();
              }}
            />
            <Divider
              style={{
                marginBottom: "4px",
                marginTop: "4px",
              }}
            />
            <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Удалить папку"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            />
          </Box>
        ) : menuType === "CREATE_TO_FOLDER" ? (
          <Box className="menu">
            <MenuItemComponent
              icon={<TableChartIcon size={13} />}
              title="Создать table"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/settings/constructor/apps/${appId}/objects/create`);
                handleCloseNotify();
              }}
            />
            <MenuItemComponent
              icon={<SyncAltIcon size={13} />}
              title="Добавить table"
              onClick={(e) => {
                e.stopPropagation();
                setTableModal(element);
                handleCloseNotify();
              }}
            />
            <MenuItemComponent
              icon={<DeveloperBoardIcon size={13} />}
              title="Добавить microfrontend"
              onClick={(e) => {
                e.stopPropagation();
                setMicrofrontendModal(element);
                handleCloseNotify();
              }}
            />
            <Divider
              style={{
                marginBottom: "4px",
                marginTop: "4px",
              }}
            />
            <MenuItemComponent
              icon={<CreateNewFolderIcon size={13} />}
              title="Добавить папку"
              onClick={(e) => {
                e.stopPropagation();
                openFolderCreateModal("create", element);
                handleCloseNotify();
              }}
            />
          </Box>
        ) : menuType === "TABLE" ? (
          <Box className="menu">
            {/* <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Переместить table"
              onClick={(e) => {
                e.stopPropagation();
                setFolderModalType("folder", element);
                handleCloseNotify();
              }}
            /> */}
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Изменить table"
              onClick={(e) => {
                e.stopPropagation();
                setTableModal(element);
                handleCloseNotify();
              }}
            />
            <Divider
              style={{
                marginBottom: "4px",
                marginTop: "4px",
              }}
            />
            <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Удалить table"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            />
          </Box>
        ) : menuType === "MICROFRONTEND" ? (
          <Box className="menu">
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Изменить microfrontend"
              onClick={(e) => {
                e.stopPropagation();
                setMicrofrontendModal(element);
                handleCloseNotify();
              }}
            />
            <Divider
              style={{
                marginBottom: "4px",
                marginTop: "4px",
              }}
            />
            <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Удалить microfrontend"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            />
          </Box>
        ) : (
          ""
        )}
      </Menu>
    </>
  );
};

export default ButtonsMenu;
