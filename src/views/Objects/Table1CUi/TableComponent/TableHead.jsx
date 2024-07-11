import React, {useState} from "react";
import styles from "./style.module.scss";
import {Box, Menu, MenuItem, Typography} from "@mui/material";
import {IOSSwitch} from "../../../../theme/overrides/IosSwitch";

function TableHead({columns}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);

  return (
    <>
      <thead>
        <tr>
          {columns?.map((item) => (
            <th>
              <div className={styles.tableHeaditem}>
                <p>{item?.label}</p>
                <button onClick={handleClick}>
                  <img src="/img/dots_horizontal.svg" alt="" />
                </button>
              </div>

              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <Box sx={{width: "244px"}}>
                  <MenuItem
                    // key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "11px 14px",
                    }}>
                    <Typography
                      sx={{
                        color: "#101828",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}>
                      Зафиксировать
                    </Typography>
                    <IOSSwitch
                      //   checked={col.visible}
                      //   onChange={() => toggleColumnVisibility(index)}
                      color="primary"
                    />
                  </MenuItem>
                  <MenuItem
                    // key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "11px 14px",
                    }}>
                    <Typography
                      sx={{
                        color: "#101828",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}>
                      Скрыть
                    </Typography>
                    <IOSSwitch
                      //   checked={col.visible}
                      //   onChange={() => toggleColumnVisibility(index)}
                      color="primary"
                    />
                  </MenuItem>
                </Box>
              </Menu>
            </th>
          ))}
        </tr>
      </thead>
    </>
  );
}

export default TableHead;
