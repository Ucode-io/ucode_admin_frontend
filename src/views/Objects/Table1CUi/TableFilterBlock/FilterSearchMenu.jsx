import React, {useState} from "react";
import {Box, Menu, TextField} from "@mui/material";
import styles from "./style.module.scss";

function FilterSearchMenu({item}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filters = [
    "Эдо фильтр 1",
    "Эдо фильтр 2",
    "Эдо фильтр 3",
    "Эдо фильтр 4",
  ];
  const filteredItems = filters.filter((filter) =>
    filter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {item?.filter === 0 ? (
        <div onClick={handleClick} className={styles.filterListItem}>
          <p>{item?.label}</p>
          <button className={styles.addFilter}>
            <img src="/img/plus.svg" alt="" />
          </button>
        </div>
      ) : (
        <div onClick={handleClick} className={styles.filterListItemActive}>
          <p className={styles.filterLabel}>{item?.label}</p>
          <p className={styles.filterCount}>{item?.filter}</p>
          <img src="/img/x_close.svg" alt="" />
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
                  padding: "15px 15px 15px 5px",
                },
              }}
            />
          </div>
          <div className={styles.menuItems}>
            {filters.map((filter, index) => (
              <div
                className={styles.menuItem}
                key={index}
                onClick={handleClose}>
                {filter}
              </div>
            ))}
          </div>
        </Box>
      </Menu>
    </>
  );
}

export default FilterSearchMenu;
