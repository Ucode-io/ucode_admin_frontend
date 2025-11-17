import {
  Box,
  Menu,
  TextField,
  Tooltip,
} from "@mui/material";
import {memo, useId, useRef, useState} from "react";
import styles from "./style.module.scss";
import IconGenerator from "@/components/IconPicker/IconGenerator";
import {iconsList} from "@/utils/constants/iconsList";
import useDebouncedWatch from "@/hooks/useDebouncedWatch";
import RowClickButton from "../RowClickButton";

const IconPickerCell = (props) => {
  const {value, setValue, field, colDef, data} = props;
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

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#0000",

        "&:hover .rowClickButton": {
          display: "block",
        },
      }}>
      <div
        style={{
          height: "31px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
        }}
        onClick={(e) => e.stopPropagation()}>
        <div
          ref={buttonRef}
          style={{backgroundColor: value ?? "transparent"}}
          aria-describedby={id}
          onClick={!field?.attributes?.disabled && handleOpen}>
          {field?.attributes?.disabled ? (
            <Tooltip title="This field is disabled for this role!">
              <img src="/table-icons/lock.svg" alt="lock" />
            </Tooltip>
          ) : (
            <IconGenerator
              size={16}
              icon={value}
              disabled={field?.attributes?.disabled}
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
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className={styles.iconsBlock}>
            {computedIconsList.map((icon) => (
              <div
                key={icon}
                className={styles.popupIconWrapper}
                onClick={() => {
                  setValue(icon);
                  handleClose();
                }}>
                <IconGenerator icon={icon} />
              </div>
            ))}
          </div>
        </Menu>
      </div>
      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} />
      {/* )} */}
    </Box>
  );
};

export default memo(IconPickerCell);
