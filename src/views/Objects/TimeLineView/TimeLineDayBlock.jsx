import React from "react";
import styles from "./styles.module.scss";
import { Popover, Typography } from "@mui/material";

export default function TimeLineDayBlock({ day, zoomPosition }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const splittedDay = day.split("/");

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <div
      style={{
        minWidth: `${zoomPosition * 30}px`
      }}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={`${styles.dayBlock} ${splittedDay[1] === "Saturday" || splittedDay[1] === "Sunday" ? styles.dayOff : ""}`}
      >
        {splittedDay[0]}
      </div>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1, background: "#384147", color: "#fff" }}>{splittedDay[0] + " / " + splittedDay[1]}</Typography>
      </Popover>
    </>
  );
}
