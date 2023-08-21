import { Box, Menu } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import "./style.scss";
import { Delete } from "@mui/icons-material";
import MenuItemComponent from "../../../MenuItem";
import { FaPlus } from "react-icons/fa";

const QueryButtonMenu = ({
  menu,
  openMenu,
  menuType,
  handleCloseNotify,
  deleteFolder,
  element,
  openFolderModal,
}) => {
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
      >
        {menuType === "FOLDER" ? (
          <>
            <Box className="menu">
              <MenuItemComponent
                icon={<RiPencilFill size={13} />}
                title="Добавить папку"
                onClick={(e) => {
                  e.stopPropagation();
                  openFolderModal(element, "CREATE");
                  handleCloseNotify();
                }}
              />
            </Box>
            <Box className="menu">
              <MenuItemComponent
                icon={<FaPlus size={13} />}
                title="Добавить Query"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseNotify();
                }}
              />
            </Box>
            <Box className="menu">
              <MenuItemComponent
                icon={<RiPencilFill size={13} />}
                title="Изменить папку"
                onClick={(e) => {
                  e.stopPropagation();
                  openFolderModal(element, "EDIT");
                  handleCloseNotify();
                }}
              />
            </Box>
            <Box className="menu">
              <MenuItemComponent
                icon={<Delete size={13} />}
                title="Удалить папку"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(element?.id);
                  handleCloseNotify();
                }}
              />
            </Box>
          </>
        ) : null}
      </Menu>
    </>
  );
};

export default QueryButtonMenu;
