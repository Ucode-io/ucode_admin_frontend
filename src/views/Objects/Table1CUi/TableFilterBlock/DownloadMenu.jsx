import React, {useState} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "./style.module.scss";
import {Box, Menu, MenuItem, Typography} from "@mui/material";

function DownloadMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <>
      <button onClick={handleClick} className={styles.moreBtn}>
        <MoreVertIcon />
      </button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{width: "286px"}}>
          <MenuItem
            onClick={handleClose}
            // key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 14px",
            }}>
            <Typography
              sx={{color: "#101828", fontWeight: 500, fontSize: "14px"}}>
              Скачать CSV
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={handleClose}
            // key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 14px",
            }}>
            <Typography
              sx={{color: "#101828", fontWeight: 500, fontSize: "14px"}}>
              Скачать XLSX
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={handleClose}
            // key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 14px",
            }}>
            <Typography
              sx={{color: "#101828", fontWeight: 500, fontSize: "14px"}}>
              Действие
            </Typography>
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}

export default DownloadMenu;
