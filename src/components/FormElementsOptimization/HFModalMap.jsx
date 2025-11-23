import React, {useState} from "react";
import {Box, Button, Dialog, TextField} from "@mui/material";
import HFMapField from "./HFMapField";
import styles from "./style.module.scss";
import {generateLink} from "../../utils/generateYandexLink";

function HFModalMap({
  defaultValue,
  isTransparent = false,
  drawerDetail = false,
  placeholder = "",
  disabled = false,
  handleChange,
  row,
  ...props
}) {
  const [open, setOpen] = useState(false);

  const value = row?.value;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        padding: drawerDetail ? "0 4.6px" : "0",
      }}
    >
      <TextField
        disabled={disabled}
        className="mapField"
        placeholder={placeholder}
        id={`map_field`}
        value={
          value
            ? generateLink(value?.split(",")?.[0], value?.split(",")?.[1])
            : ""
        }
        defaultValue={defaultValue}
        variant="standard"
        width="small"
        onClick={() => {
          if (disabled) return;
          handleOpen();
        }}
        sx={{
          width: "330px",
          paddingLeft: "5px",
          "& input": {
            cursor: disabled ? "not-allowed" : "pointer",
          },
        }}
        InputProps={{
          style: {
            background: isTransparent ? "transparent" : "",
            height: "100%",
            padding: "0 0",
          },
          classes: {
            notchedoutline: {},
          },
          disableUnderline: true,
        }}
        {...props}
      />

      <Dialog open={open} onClose={handleClose}>
        <div className={styles.mapField}>
          <HFMapField
            handleChange={handleChange}
            row={row}
            width={"500px"}
            height={"400px"}
          />

          <Box>
            <Button onClick={handleClose} variant="outlined" color="error">
              Cancel
            </Button>
            <Button
              onClick={handleClose}
              sx={{ marginLeft: "10px" }}
              variant="outlined"
            >
              Confirm
            </Button>
          </Box>
        </div>
      </Dialog>
    </Box>
  );
}

export default HFModalMap;
