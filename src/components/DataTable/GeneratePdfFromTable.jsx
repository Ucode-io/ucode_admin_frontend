import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Menu } from "@mui/material";
import React from "react";
import styles from "./GeneratePdfFromTable.module.scss";
import PdfMenuList from "./PdfMenuList";

export default function GeneratePdfFromTable({ row }) {
  const [anchorEl, setAnchorEl] = React.useState(null);  
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <div className={styles.wrapper}>
      <button
        color="info"
        onClick={(e) => handleClick(e)}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        maxWidth="32px"
      >
        <PictureAsPdfIcon color="info" />
      </button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* {templates?.map((template, index) => (
          <MenuItem onClick={(e) => navigateToDocumentEditPage(template, e)} key={template.id}>
            {template.title}
          </MenuItem>
        ))} */}

        <PdfMenuList />
      </Menu>
    </div>
  );
}
