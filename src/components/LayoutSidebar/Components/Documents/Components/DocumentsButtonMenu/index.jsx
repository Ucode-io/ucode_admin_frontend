import { Box, Menu } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import MenuItemComponent from "../../../../MenuItem";

const DocumentButtonMenu = ({
  selected,
  menu,
  openMenu,
  menuType,
  element,
  handleCloseNotify,
  deleteNoteFolder,
  deleteTemplateFolder,
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
      >
        {menuType === "FOLDER" && (
          <Box className="menu">
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Добавить Note"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/main/12/docs/note/create`);
                handleCloseNotify();
              }}
            />
          </Box>
        )}
        {menuType === "NOTE" && (
          <Box className="menu">
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Удалить Note"
              onClick={(e) => {
                e.stopPropagation();
                deleteNoteFolder({ id: element.id });
                handleCloseNotify();
              }}
            />
          </Box>
        )}
        {menuType === "TEMPLATE" && (
          <Box className="menu">
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Удалить Template"
              onClick={(e) => {
                e.stopPropagation();
                deleteTemplateFolder({ id: element.id });
                handleCloseNotify();
              }}
            />
          </Box>
        )}
      </Menu>
    </>
  );
};

export default DocumentButtonMenu;
