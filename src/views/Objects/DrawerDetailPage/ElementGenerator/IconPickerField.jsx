import {
  CircularProgress,
  IconButton,
  Menu,
  TextField,
  Tooltip,
} from "@mui/material";
import {memo, useId, useMemo, useRef, useState} from "react";
import styles from "./style.module.scss";
import {Lock} from "@mui/icons-material";
import useDebouncedWatch from "../../../../hooks/useDebouncedWatch";
import {iconsList} from "../../../../utils/constants/iconsList";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";

const IconPickerField = ({
  value = "",
  onChange,
  customeClick,
  clickItself,
  tabIndex,
  error,
  loading = false,
  shape = "circle",
  disabled,
  drawerDetail = false,
  ...props
}) => {
  const buttonRef = useRef();
  const id = useId();

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [computedIconsList, setComputedIconsList] = useState(
    iconsList.slice(0, 40)
  );

  const handleClose = () => setDropdownIsOpen(false);

  const handleOpen = () => setDropdownIsOpen(true);

  useDebouncedWatch(
    () => {
      const filteredList = iconsList.filter((icon) =>
        icon.includes(searchText)
      );

      setComputedIconsList(filteredList.slice(0, 40));
    },
    [searchText],
    300
  );

  useDebouncedWatch(
    () => {
      if (!searchText) return;

      axios
        .get(`https://api.iconify.design/search?query=${searchText}`)
        .then((res) => {
          const apiIcons = res?.data?.icons || [];

          const localIcons = iconsList.filter((icon) =>
            icon.includes(searchText)
          );

          const merged = [...new Set([...localIcons, ...apiIcons])];

          setComputedIconsList(merged.slice(0, 40));
        })
        .catch((err) => {
          console.error("Failed to fetch icons", err);
        });
    },
    [searchText],
    500
  );

  if (loading)
    return (
      <IconButton color="primary">
        <CircularProgress size={17} />
      </IconButton>
    );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: drawerDetail ? "0 9.6px" : "0",
      }}
      onClick={(e) => e.stopPropagation()}
      {...props}>
      <div
        ref={buttonRef}
        className={`${styles.iconWrapper} ${error ? styles.error : ""} ${styles[shape]}`}
        style={{backgroundColor: value ?? "#fff"}}
        aria-describedby={id}
        onClick={customeClick ? clickItself : !disabled && handleOpen}>
        {disabled ? (
          <Tooltip title="This field is disabled for this role!">
            <Lock
              style={{
                fontSize: "20px",
                color: "#adb5bd",
                cursor: "not-allowed",
              }}
            />
          </Tooltip>
        ) : (
          <IconGenerator
            style={{width: "15px", height: "15px"}}
            icon={value}
            disabled={disabled}
          />
        )}
      </div>

      <Menu
        id={id}
        anchorEl={buttonRef.current}
        onClose={handleClose}
        open={dropdownIsOpen}
        anchorOrigin={{horizontal: "left", vertical: "bottom"}}
        classes={{paper: styles.menuPaper, list: styles.menuList}}>
        <TextField
          size="small"
          fullWidth
          value={searchText}
          autoFocus={tabIndex === 1}
          inputProps={{tabIndex}}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className={styles.iconsBlock}>
          {computedIconsList.map((icon) => (
            <div
              key={icon}
              className={styles.popupIconWrapper}
              onClick={() => {
                onChange(icon);
                handleClose();
              }}>
              <IconGenerator icon={icon} />
            </div>
          ))}
        </div>
      </Menu>
    </div>
  );
};

export default memo(IconPickerField);
