import {Check} from "@mui/icons-material";
import {Box, Menu, MenuItem} from "@mui/material";
import { useScreenOptionsProps } from "./useScreenOptionsProps";

export const ScreenOptions = () => {

  const {
    selectedViewType,
    handleSelectOption,
    handleClose,
    handleClick,
    anchorEl,
    options,
  } = useScreenOptionsProps()

  return (
    <Box>
      <Box onClick={handleClick} sx={{cursor: "pointer", "&:hover": {backgroundColor: "rgba(55, 53, 47, 0.06)"}}} >
        <span>{getColumnFieldIcon(selectedViewType)}</span>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}>
        <Box sx={{width: "220px", padding: "4px 0"}}>
          {options.map((option) => (
            <MenuItem
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "6px",
                color: "#37352f",
              }}
              key={option.label}
              onClick={() => handleSelectOption(option)}>
              <Box sx={{display: "flex", alignItems: "center", gap: "5px"}}>
                <span>{getColumnFieldIcon(option?.icon)}</span>
                {option.label}
              </Box>

              <Box>{option?.icon === selectedViewType ? <Check /> : ""}</Box>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};

export const getColumnFieldIcon = (column) => {
  if (column === "SidePeek") {
    return (
      <img
        src="/img/drawerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else if (column === "CenterPeek") {
    return (
      <img
        src="/img/centerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else
    return (
      <img
        src="/img/fullpagePeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
};
