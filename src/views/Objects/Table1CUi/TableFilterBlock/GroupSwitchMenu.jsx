import {Box, Menu, MenuItem, Typography} from "@mui/material";
import React from "react";
import {IOSSwitch} from "../../../../theme/overrides/IosSwitch";

function GroupSwitchMenu({
  columns = [],
  toggleColumnVisibility = () => {},
  setColumns,
  anchorEl,
  handleClose,
  open,
}) {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <Box sx={{width: "360px"}}>
        <MenuItem
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderBottom: "1px solid #d0d5dd",
          }}>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#101828",
              fontWeight: 500,
            }}>
            Показать все
          </Typography>
          <IOSSwitch
            checked={columns.every((col) => col.visible)}
            onChange={() => {
              const allVisible = columns.every((col) => col.visible);
              setColumns((prevColumns) =>
                prevColumns.map((col) => ({...col, visible: !allVisible}))
              );
            }}
          />
        </MenuItem>
        {columns.map((col, index) => (
          <MenuItem
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
            }}>
            <Typography
              sx={{color: "#101828", fontWeight: 500, fontSize: "14px"}}>
              {col.label}
            </Typography>
            <IOSSwitch
              checked={col.visible}
              onChange={() => toggleColumnVisibility(index)}
              color="primary"
            />
          </MenuItem>
        ))}
      </Box>
    </Menu>
  );
}

export default GroupSwitchMenu;
