import { menuActions } from "@/store/menuItem/menuItem.slice";
import { Menu, Box, MenuItem } from "@mui/material";
import { BsFillTrashFill } from "react-icons/bs";
import { RiPencilFill } from "react-icons/ri";
import SVG from "react-inlinesvg";
import { useDispatch } from "react-redux";

export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

export const NodeActionsMenu = ({
  anchorEl,
  open,
  onClose,
  node,
  handlers,
  setSelectedFolder,
  selectedApp,
}) => {
  const {
    openFolderCreateModal,
    openTableCreateModal,
    deleteFolder,
    setTableModal,
    setMicrofrontendModal,
    setWebsiteModalLink,
    setFolderModalType,
    setTemplatePopover,
    handleOpenNotify,
  } = handlers;

  const dispatch = useDispatch();

  const type = node?.type;
  const permission = node?.data?.permission;

  const folderSettings = (e) => {
    e.stopPropagation();
    setSelectedFolder(node);
    dispatch(menuActions.setMenuItem(node));
    if (selectedApp?.id !== adminId) {
      if (
        type === "FOLDER" ||
        (type === "WIKI_FOLDER" &&
          node?.id !== "cd5f1ab0-432c-459d-824a-e64c139038ea")
      ) {
        handleOpenNotify(e, "FOLDER");
      } else if (type === "TABLE") {
        handleOpenNotify(e, "TABLE");
      } else if (type === "WIKI") {
        handleOpenNotify(e, "WIKI");
      } else if (type === "MICROFRONTEND") {
        handleOpenNotify(e, "MICROFRONTEND");
      } else if (type === "MINIO_FOLDER") {
        handleOpenNotify(e, "MINIO_FOLDER");
      } else if (type === "LINK") {
        handleOpenNotify(e, "LINK");
      }
    }
  };

  const ActionItem = ({ icon, title, onClick, show = true }) => {
    if (!show) return null;
    return (
      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
          onClose();
        }}
        sx={{ gap: 1, fontSize: "13px" }}
      >
        {icon}
        {title}
      </MenuItem>
    );
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 3px 8px rgba(0,0,0,0.24))",
          padding: "4px",
          minWidth: 180,
        },
      }}
    >
      {(type === "FOLDER" || type === "ROOT") && (
        <Box>
          <ActionItem
            icon={<SVG src="/img/layout-alt-01.svg" width={16} />}
            title="Create table"
            onClick={() => openTableCreateModal("create", node)}
          />
          {/* ... Добавьте остальные типы по аналогии из вашего старого кода ... */}
        </Box>
      )}
      {/* Пример логики для FOLDER */}
      {type === "FOLDER" && (
        <>
          <Box>
            <ActionItem
              show={permission?.update}
              icon={<RiPencilFill size={13} />}
              title="Edit folder"
              onClick={() => openFolderCreateModal("update", node)}
            />
          </Box>
          <Box borderTop={"1px solid #e0e0e0"}>
            <ActionItem
              show={permission?.delete}
              icon={<BsFillTrashFill size={13} />}
              title="Delete folder"
              onClick={() => deleteFolder(node)}
            />
          </Box>
        </>
      )}
    </Menu>
  );
};
