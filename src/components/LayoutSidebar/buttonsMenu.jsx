import { Box, Menu } from "@mui/material";
import { AiOutlinePlus } from "react-icons/ai";
import { RiPencilFill } from "react-icons/ri";
import "./style.scss";
import { BsFillTrashFill } from "react-icons/bs";

const ButtonsMenu = ({
  element,
  menu,
  openMenu,
  handleCloseNotify,
  sidebarIsOpen,
  openFolderCreateModal,
  environment,
  deleteFolder,
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
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
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
        {!element?.isChild && sidebarIsOpen ? (
          <Box className="menu">
            <Box
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                openFolderCreateModal("update", element);
              }}
            >
              <RiPencilFill
                size={13}
                style={{
                  color: environment?.data?.color,
                }}
              />
              <h3>Изменить папку</h3>
            </Box>
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openFolderCreateModal("parent", element);
              }}
            >
              <AiOutlinePlus
                size={13}
                style={{
                  color: environment?.data?.color,
                }}
              />
              <h3>Добавить папку</h3>
            </Box>
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteFolder(element);
              }}
            >
              <BsFillTrashFill
                size={13}
                style={{
                  color: environment?.data?.color,
                }}
              />
              <h3>Удалить папку</h3>
            </Box>
          </Box>
        ) : (
          ""
        )}
      </Menu>
    </>
  );
};

export default ButtonsMenu;
