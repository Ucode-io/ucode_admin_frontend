import { Menu, Box, MenuItem } from '@mui/material';
import { BsFillTrashFill } from 'react-icons/bs';
import { RiPencilFill } from 'react-icons/ri';
import SVG from "react-inlinesvg"

export const NodeActionsMenu = ({ anchorEl, open, onClose, node, handlers }) => {
  // const { 
  //   openFolderCreateModal, openTableCreateModal, deleteFolder, 
  //   setTableModal, setMicrofrontendModal, setWebsiteModalLink,
  //   setFolderModalType, setTemplatePopover, navigate 
  // } = handlers;

  console.log({node})

  const type = node?.type;
  const permission = node?.data?.permission;

  const ActionItem = ({ icon, title, onClick, show = true }) => {
    if (!show) return null;
    return (
      <MenuItem onClick={(e) => { e.stopPropagation(); onClick(e); onClose(); }} sx={{ gap: 1, fontSize: '13px' }}>
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
      {/* Пример логики для FOLDER */}
      {type === "FOLDER" && (
        <Box>
          <ActionItem 
            show={permission?.update} 
            icon={<RiPencilFill size={13} />} 
            title="Edit folder" 
            // onClick={() => openFolderCreateModal("update", node)} 
          />
          <ActionItem 
            show={permission?.delete} 
            icon={<BsFillTrashFill size={13} />} 
            title="Delete folder" 
            // onClick={() => deleteFolder(node)} 
          />
        </Box>
      )}

      {/* Логика для добавления контента (Plus Button Menu / Create to folder) */}
      {(type === "FOLDER" || type === "ROOT") && (
        <Box>
           <ActionItem 
            icon={<SVG src="/img/layout-alt-01.svg" width={16} />} 
            title="Create table" 
            // onClick={() => openTableCreateModal("create", node)} 
          />
          {/* ... Добавьте остальные типы по аналогии из вашего старого кода ... */}
        </Box>
      )}
    </Menu>
  );
};