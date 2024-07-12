import {Box, Fade, Menu, TextField} from "@mui/material";
import {useMemo, useState} from "react";

import styles from "./style.module.scss";

const FilterAutoComplete = ({
  options = [],
  searchText,
  setSearchText,
  localCheckedValues,
  value = [],
  onChange = () => {},
  label,
  field,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const computedValue = useMemo(() => {
    return value
      ?.map((el) => options?.find((option) => option.value === el))
      .filter((el) => el);
  }, [value, options]);

  // const inputChangeHandler = useDebounce((val) => {
  //   setSearchText(val);
  // }, 300);

  const closeMenu = () => {
    setAnchorEl(null);
    setSearchText("");
  };

  const rowClickHandler = (option) => {
    handleClose();
    if (value?.includes(option.value)) {
      onChange(value.filter((item) => item !== option.value));
    } else {
      onChange([...value, option.value]);
    }
  };

  const onClearButtonClick = (e) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className={styles.autocomplete}>
      {field?.filter === 0 ? (
        <div className={styles.filterListItemActive}>
          <p>{field?.label}</p>
          <button onClick={handleClick} className={styles.addFilter}>
            <img src="/img/x_close.svg" alt="" />
          </button>
        </div>
      ) : (
        <div onClick={handleClick} className={styles.filterListItem}>
          <p className={styles.filterLabel}>{field?.label}</p>
          <p className={styles.filterCount}>{field?.filter}</p>

          <img src="/img/plus.svg" alt="" />
        </div>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        TransitionComponent={Fade}
        onClose={handleClose}
        classes={{list: styles.menu, paper: styles.paper}}>
        <Box sx={{width: "326px"}}>
          <div className={styles.searchBox}>
            <button className={styles.searchBtn}>
              <img src="/img/search_icon.svg" alt="" />
            </button>
            <TextField
              variant="outlined"
              placeholder="Поиск"
              // value={searchTerm}
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
                  padding: "15px 15px 15px 0px",
                },
              }}
            />
          </div>
          <div className={styles.menuItems}>
            {options?.map((filter, index) => (
              <div
                className={styles.menuItem}
                key={index}
                onClick={() => {
                  rowClickHandler(filter);
                }}>
                {filter?.label}
              </div>
            ))}
          </div>
        </Box>
      </Menu>
    </div>
  );
};

export default FilterAutoComplete;
