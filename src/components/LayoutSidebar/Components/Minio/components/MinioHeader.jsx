import { Box, Tooltip, Typography } from "@mui/material";
import style from "../style.module.scss";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddIcon from "@mui/icons-material/Add";

const MinioHeader = ({ menuItem, openModal, minios }) => {
  return (
    <>
      <Box className={style.header}>
        <Box className={style.leftside}>
          <div className={style.foldericon}>
            <FolderOpenIcon />
          </div>
          <Typography variant="h3">{menuItem?.label}</Typography>
        </Box>
        <Box className={style.rightside}>
          <Typography variant="h5" className={style.itemtitle}>
            {minios?.objects?.length || "0"} Items
          </Typography>
          <Tooltip title="Create folder">
            <div className={style.createicon}>
              <CreateNewFolderIcon />
            </div>
          </Tooltip>
          <Tooltip title="Create item">
            <div className={style.addicon} onClick={openModal}>
              <AddIcon />
            </div>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
};

export default MinioHeader;
