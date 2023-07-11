import { Box, Divider, Menu } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import "./style.scss";
import { BsFillTrashFill } from "react-icons/bs";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import TableChartIcon from "@mui/icons-material/TableChart";
import { useNavigate } from "react-router-dom";
import MenuItemComponent from "./MenuItem";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useMenuCreateMutation } from "../../services/menuService";
import WebIcon from "@mui/icons-material/Web";
const ButtonsMenu = ({
  element,
  menu,
  openMenu,
  handleCloseNotify,
  openFolderCreateModal,
  deleteFolder,
  menuType,
  setFolderModalType,
  appId,
  setTableModal,
  setMicrofrontendModal,
  setWebPageModal,
}) => {
  const { mutateAsync: createMenu, isLoading: createLoading } =
    useMenuCreateMutation();
  const navigate = useNavigate();

  const onFavourite = (element, type) => {
    type === "TABLE"
      ? createMenu({
          parent_id: "c57eedc3-a954-4262-a0af-376c65b5a282",
          type: type,
          table_id: element?.data?.table?.id,
        })
      : type === "FOLDER"
      ? createMenu({
          parent_id: "c57eedc3-a954-4262-a0af-376c65b5a282",
          type: type,
          folder_id: element?.id,
          label: element?.label,
          icon: element?.icon,
        })
      : type === "MICROFRONTEND"
      ? createMenu({
          parent_id: "c57eedc3-a954-4262-a0af-376c65b5a282",
          type: type,
          microfrontend_id: element?.data?.microfrontend?.id,
        })
      : createMenu({
          parent_id: "c57eedc3-a954-4262-a0af-376c65b5a282",
          type: type,
          webpage_id: element?.data?.webpage?.id,
        });
  };

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
            {element?.data?.permission?.update && (
              <MenuItemComponent
                icon={<RiPencilFill size={13} />}
                title="Изменить папку"
                onClick={(e) => {
                  e.stopPropagation();
                  openFolderCreateModal("update", element);
                  handleCloseNotify();
                }}
              />
            )}

            <Divider
              style={{
                marginBottom: "4px",
                marginTop: "4px",
              }}
            />
            {element?.data?.permission?.delete && (
              <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Удалить папку"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            />
            )}
           {element?.data?.permission?.menu_settings &&  (
             <MenuItemComponent
             icon={<RiPencilFill size={13} />}
             title="Переместить folder"
             onClick={(e) => {
               e.stopPropagation();
               setFolderModalType("folder", element);
               handleCloseNotify();
             }}
           />
           )}
            {element?.parent_id !== "c57eedc3-a954-4262-a0af-376c65b5a282" && (
              <>
                <Divider
                  style={{
                    marginBottom: "4px",
                    marginTop: "4px",
                  }}
                />
               {element?.data?.permission?.menu_settings && (
                 <MenuItemComponent
                 icon={<StarBorderIcon size={13} />}
                 title="Favourite"
                 onClick={(e) => {
                   e.stopPropagation();
                   handleCloseNotify();
                   onFavourite(element, "FOLDER");
                 }}
               />
               )}
              </>
            )}
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
            <MenuItemComponent
              icon={<WebIcon size={13} />}
              title="Добавить web-page"
              onClick={(e) => {
                e.stopPropagation();
                setWebPageModal(element);
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
           {element?.data?.permission?.menu_settings && (
             <MenuItemComponent
             icon={<RiPencilFill size={13} />}
             title="Переместить table"
             onClick={(e) => {
               e.stopPropagation();
               setFolderModalType("folder", element);
               handleCloseNotify();
             }}
           />
           )}

          {element?.data?.permission?.menu_settings && (
            <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Изменить table"
              onClick={(e) => {
                e.stopPropagation();
                setTableModal(element);
                handleCloseNotify();
              }}
            />
            )}
            <Divider
              style={{
                marginBottom: "4px",
                marginTop: "4px",
              }}
            />
            {element?.data?.permission?.delete && (
              <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Удалить table"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            />
            )}
            {element?.parent_id !== "c57eedc3-a954-4262-a0af-376c65b5a282" && (
              <>
                <Divider
                  style={{
                    marginBottom: "4px",
                    marginTop: "4px",
                  }}
                />
                <MenuItemComponent
                  icon={<StarBorderIcon size={13} />}
                  title="Favourite"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseNotify();
                    onFavourite(element, "TABLE");
                  }}
                />
              </>
            )}
          </Box>
        ) : menuType === "MICROFRONTEND" ? (
          <Box className="menu">
           {element?.data?.permission?.menu_settings && (
             <MenuItemComponent
             icon={<RiPencilFill size={13} />}
             title="Переместить microfrontend"
             onClick={(e) => {
               e.stopPropagation();
               setFolderModalType("folder", element);
               handleCloseNotify();
             }}
           />
           )}
           {element?.data?.permission?.menu_settings && (
             <MenuItemComponent
             icon={<RiPencilFill size={13} />}
             title="Изменить microfrontend"
             onClick={(e) => {
               e.stopPropagation();
               setMicrofrontendModal(element);
               handleCloseNotify();
             }}
           />
           )}
            <Divider
              style={{
                marginBottom: "4px",
                marginTop: "4px",
              }}
            />
            {element?.data?.permission?.delete && (
              <MenuItemComponent
              icon={<BsFillTrashFill size={13} />}
              title="Удалить microfrontend"
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(element);
                handleCloseNotify();
              }}
            />
            )}
            {element?.parent_id !== "c57eedc3-a954-4262-a0af-376c65b5a282" && (
              <>
                <Divider
                  style={{
                    marginBottom: "4px",
                    marginTop: "4px",
                  }}
                />
                <MenuItemComponent
                  icon={<StarBorderIcon size={13} />}
                  title="Favourite"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseNotify();
                    onFavourite(element, "MICROFRONTEND");
                  }}
                />
              </>
            )}
          </Box>
        ) : menuType === "WEBPAGE" ? (
          <Box className="menu">
            {element?.data?.permission?.menu_settings && (
              <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Переместить webpage"
              onClick={(e) => {
                e.stopPropagation();
                setFolderModalType("folder", element);
                handleCloseNotify();
              }}
            />
            )}
            {element?.data?.permission?.menu_settings && (
              <MenuItemComponent
              icon={<RiPencilFill size={13} />}
              title="Изменить webpage"
              onClick={(e) => {
                e.stopPropagation();
                setWebPageModal(element);
                handleCloseNotify();
              }}
            />
            )}
            <Divider
              style={{
                marginBottom: "4px",
                marginTop: "4px",
              }}
            />
           {element?.data?.permission?.delete && (
             <MenuItemComponent
             icon={<BsFillTrashFill size={13} />}
             title="Удалить webpage"
             onClick={(e) => {
               e.stopPropagation();
               deleteFolder(element);
               handleCloseNotify();
             }}
           />
           )}
            {element?.parent_id !== "c57eedc3-a954-4262-a0af-376c65b5a282" && (
              <>
                <Divider
                  style={{
                    marginBottom: "4px",
                    marginTop: "4px",
                  }}
                />
                <MenuItemComponent
                  icon={<StarBorderIcon size={13} />}
                  title="Favourite"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseNotify();
                    onFavourite(element, "WEBPAGE");
                  }}
                />
              </>
            )}
          </Box>
        ) : (
          <Box className="menu">
            {element?.data?.permission?.menu_settings && (
              <MenuItemComponent
              icon={<TableChartIcon size={13} />}
              title="Создать table"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/settings/constructor/apps/${appId}/objects/create`);
                handleCloseNotify();
              }}
            />
            )}
            <MenuItemComponent
              icon={<SyncAltIcon size={13} />}
              title="Добавить table"
              onClick={(e) => {
                e.stopPropagation();
                setTableModal({ id: "c57eedc3-a954-4262-a0af-376c65b5a284" });
                handleCloseNotify();
              }}
            />
            <MenuItemComponent
              icon={<DeveloperBoardIcon size={13} />}
              title="Добавить microfrontend"
              onClick={(e) => {
                e.stopPropagation();
                setMicrofrontendModal({
                  id: "c57eedc3-a954-4262-a0af-376c65b5a284",
                });
                handleCloseNotify();
              }}
            />
            <MenuItemComponent
              icon={<WebIcon size={13} />}
              title="Добавить web-page"
              onClick={(e) => {
                e.stopPropagation();
                setWebPageModal({
                  id: "c57eedc3-a954-4262-a0af-376c65b5a284",
                });
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
                openFolderCreateModal("create", {
                  id: "c57eedc3-a954-4262-a0af-376c65b5a284",
                });
                handleCloseNotify();
              }}
            />
          </Box>
        )}
      </Menu>
    </>
  );
};

export default ButtonsMenu;
