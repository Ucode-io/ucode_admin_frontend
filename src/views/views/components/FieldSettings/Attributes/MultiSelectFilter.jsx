import { ArrowDropDown, Close } from "@mui/icons-material";
import { Divider, IconButton, Menu } from "@mui/material";
import React, { useState } from "react";
import SearchInput from "@/components/SearchInput";
import styles from "./style.module.scss";

function MultiSelectFilter({ options }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuVisible = Boolean(anchorEl);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    // setSearchText("");
  };

  const rowClickHandler = () => {
    // if (value?.includes(option.value)) {
    //   onChange(value.filter((item) => item !== option.value));
    // } else {
    //   onChange([...value, option.value]);
    // }
  };


  return (
    <div className={styles.autocomplete}>
      <div className={styles.autocompleteButton} onClick={openMenu}>
        <div className={styles.autocompleteValue}>
          {/* {computedValue?.[0]?.label || ( */}
          <span
            className={styles.placeholder}
            // style={{ color: !value?.length ? "#909EAB" : "#000" }}
          >
            {/* {!value?.length ? label : value[0]} */}
          </span>
          {/* )} */}
        </div>
        {/* {computedValue?.length > 1 && `+${computedValue.length - 1}`}
        {!!computedValue?.length && ( */}
        <IconButton onClick={""}>
          <Close />
        </IconButton>
        {/* )} */}
        <ArrowDropDown />
      </div>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        // TransitionComponent={Fade}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <SearchInput fullWidth onChange={""} placeholder={"label"} />

        <div className={styles.scrollBlock}>
          {/*{computedValue?.map((option) => (*/}
          {/*  <div*/}
          {/*    onClick={() => rowClickHandler(option)}*/}
          {/*    key={option.value}*/}
          {/*    className={styles.option}*/}
          {/*  >*/}
          {/*    <Checkbox checked/>*/}
          {/*    <p className={styles.label}>{option.label}</p>*/}
          {/*  </div>*/}
          {/*))}*/}

          <Divider />

          {options?.map((option) => (
            <div
              onClick={() => rowClickHandler(option)}
              key={option.value}
              className={styles.option}
            >
              {/* {computedValue
                .map((item) => item.value)
                .includes(option.value) ? (
                <Checkbox checked />
              ) : (
                <Checkbox />
              )} */}

              <p className={styles.label}>{option.label}</p>
            </div>
          ))}
        </div>
      </Menu>
    </div>
  );
}

export default MultiSelectFilter;
