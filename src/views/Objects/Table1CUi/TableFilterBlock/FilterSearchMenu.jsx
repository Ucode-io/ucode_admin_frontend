import React, {useState} from "react";
import {Box, Menu, TextField} from "@mui/material";
import styles from "./style.module.scss";

function FilterSearchMenu({item, view, fieldsMap}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSearch = (e) => setSearchTerm(e.target.value);

  return (
    <>
      {item?.filter === 0 ? (
        <div className={styles.filterListItemActive}>
          <p>{item?.label}</p>
          <button onClick={handleClick} className={styles.addFilter}>
            <img src="/img/x_close.svg" alt="" />
          </button>
        </div>
      ) : (
        <div onClick={handleClick} className={styles.filterListItem}>
          <p className={styles.filterLabel}>{item?.label}</p>
          <p className={styles.filterCount}>{item?.filter}</p>

          <img src="/img/plus.svg" alt="" />
        </div>
      )}

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{width: "326px"}}>
          <div className={styles.searchBox}>
            <button className={styles.searchBtn}>
              <img src="/img/search_icon.svg" alt="" />
            </button>
            <TextField
              variant="outlined"
              placeholder="Поиск"
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
              InputProps={{
                sx: {
                  height: "44px",
                  padding: 0,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  padding: "0 10px",
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "15px 15px 15px 15px",
                },
              }}
            />
          </div>
          <div className={styles.menuItems}>
            {view?.attribtes?.quick_filters.map((filter, index) => (
              <div
                className={styles.menuItem}
                key={index}
                onClick={handleClose}>
                {filter?.label}
              </div>
            ))}
          </div>
        </Box>
      </Menu>
    </>
  );
}

export default FilterSearchMenu;
