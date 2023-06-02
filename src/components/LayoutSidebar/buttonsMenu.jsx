import { Box, Divider, Menu } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import "./style.scss";
import { BsFillTrashFill } from "react-icons/bs";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import TableChartIcon from "@mui/icons-material/TableChart";
import { useNavigate } from "react-router-dom";

const ButtonsMenu = ({
  element,
  menu,
  openMenu,
  handleCloseNotify,
  sidebarIsOpen,
  openFolderCreateModal,
  deleteFolder,
  menuType,
  setFolderModalType,
  setSelectedTable,
  appId,
  setTableModal,
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
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
              padding: "5px",
            },
          },
        }}
      >
        {!element?.isChild && sidebarIsOpen && menuType === "folder" ? (
          <Box className="menu">
            <Box
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                openFolderCreateModal("update", element);
                handleCloseNotify();
              }}
            >
              <RiPencilFill size={13} />
              <h3>Изменить папку</h3>
            </Box>
            <Divider
              style={{
                marginBottom: "8px",
                marginTop: "8px",
              }}
            />
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            >
              <BsFillTrashFill size={13} />
              <h3>Удалить папку</h3>
            </Box>
          </Box>
        ) : !element?.isChild && sidebarIsOpen && menuType === "tableMenu" ? (
          <Box className="menu">
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/settings/constructor/apps/${appId}/objects/create`);
                handleCloseNotify();
              }}
            >
              <TableChartIcon size={13} />
              <h3>Создать table</h3>
            </Box>
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTableModal(element);
                handleCloseNotify();
              }}
            >
              <TableChartIcon size={13} />
              <h3>Добавить table</h3>
            </Box>
            <Divider
              style={{
                marginBottom: "8px",
                marginTop: "8px",
              }}
            />
            <Box
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                openFolderCreateModal("create", element);
                handleCloseNotify();
              }}
            >
              <CreateNewFolderIcon size={13} />
              <h3>Добавить папку</h3>
            </Box>
          </Box>
        ) : (
          <Box className="menu">
            <Box
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setFolderModalType("folder");
                setSelectedTable(element);
                handleCloseNotify();
              }}
            >
              <RiPencilFill size={13} />
              <h3>Переместить</h3>
            </Box>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default ButtonsMenu;
