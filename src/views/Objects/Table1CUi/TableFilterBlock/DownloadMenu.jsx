import React, {useState} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "./style.module.scss";
import {Box, Menu, MenuItem, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";

function DownloadMenu({menuItem}) {
  const {appId} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const navigateToSettingsPage = () => {
    const url = `/settings/constructor/apps/${appId}/objects/${menuItem?.table_id}/${menuItem?.data?.table?.slug}?menuId=${menuItem?.id}`;
    navigate(url);
  };

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
              onClick={navigateToSettingsPage}
              sx={{color: "#101828", fontWeight: 500, fontSize: "14px"}}>
              Settings
            </Typography>
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}

export default DownloadMenu;
