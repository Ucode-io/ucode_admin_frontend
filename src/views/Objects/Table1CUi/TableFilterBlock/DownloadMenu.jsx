import React, {useState} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "./style.module.scss";
import {Box, CircularProgress, Menu, MenuItem, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import constructorObjectService from "../../../../services/constructorObjectService";
import useFilters from "../../../../hooks/useFilters";
import {useTranslation} from "react-i18next";
import useDownloader from "../../../../hooks/useDownloader";

function DownloadMenu({
  menuItem,
  fieldSlugId,
  fieldSlug,
  view,
  visibleFields,
  sort,
}) {
  const {appId, tableSlug} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const {t, i18n} = useTranslation();
  const open = Boolean(anchorEl);
  const {filters} = useFilters(tableSlug, view?.id);
  const {download} = useDownloader();
  const [loader, setLoader] = useState(false);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const onClick = async () => {
    try {
      setLoader(true);
      const {data} = await constructorObjectService.downloadExcel(tableSlug, {
        data: {
          [fieldSlug]: fieldSlugId,
          ...sort,
          ...filters,
          field_ids: visibleFields,
          language: i18n?.language,
        },
      });

      const fileName = `${tableSlug}.xlsx`;
      // window.open('https://' + data.link, { target: '__blank' })
      await download({link: "https://" + data.link, fileName});
    } finally {
      handleClose();
      setLoader(false);
    }
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
            onClick={() => {
              onClick();
            }}
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
            {loader && (
              <div>
                <CircularProgress size={24} />
              </div>
            )}
          </MenuItem>
          {/* <MenuItem
            onClick={() => {
              navigateToSettingsPage();
              handleClose();
            }}
            // key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 14px",
            }}>
            <Typography
              sx={{color: "#101828", fontWeight: 500, fontSize: "14px"}}>
              Settings
            </Typography>
          </MenuItem> */}
        </Box>
      </Menu>
    </>
  );
}

export default DownloadMenu;
