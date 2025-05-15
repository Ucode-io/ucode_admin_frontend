import React, {useState} from "react";
import styles from "./style.module.scss";
import {Box, Button, Dialog, TextField} from "@mui/material";
import {generateLink} from "../../../../utils/generateYandexLink";
import HFMapFieldCellEditor from "./MapCellEditorComponents/HFMapFieldCellEditor";
import RowClickButton from "../RowClickButton";

function HFModalMapCellEditor(props) {
  const [open, setOpen] = useState(false);
  const {value, setValue, isTransparent = false, data, colDef} = props;

  const field = props?.colDef?.fieldObj;

  const disabled =
    field?.attributes?.disabled ||
    !field?.attributes?.field_permission?.edit_permission;

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      {" "}
      <Box>
        <TextField
          disabled={field?.attributes?.disabled}
          id={`map_field`}
          value={
            value
              ? generateLink(value?.split(",")?.[0], value?.split(",")?.[1])
              : ""
          }
          defaultValue={"defaultValue"}
          variant="standard"
          width="small"
          onClick={() => !disabled && handleOpen()}
          sx={{
            width: "100%",
            backgroundColor: "transparent",
            "& .MuiInputBase-root": {
              backgroundColor: "transparent",
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "transparent",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
          }}
          InputProps={{
            endAdornment: disabled ? (
              <img src="/table-icons/lock.svg" alt="lock" />
            ) : (
              ""
            ),
            style: {
              background: isTransparent ? "transparent" : "",
              height: "100%x",
              height: "100%",
              padding: "0 14px 0 0",
            },
            classes: {
              notchedoutline: {},
            },
            disableUnderline: true,
          }}
          className="custom_textfield_new"
        />

        <Dialog open={open} onClose={handleClose}>
          <div className={styles.mapField}>
            <HFMapFieldCellEditor
              value={value}
              field={field}
              width={"500px"}
              height={"400px"}
              onChange={setValue}
              isNewTableView={false}
              defaultValue={"defaultValue"}
            />

            <Box>
              <Button onClick={handleClose} variant="outlined" color="error">
                Cancel
              </Button>
              <Button
                onClick={handleClose}
                sx={{marginLeft: "10px"}}
                variant="outlined">
                Confirm
              </Button>
            </Box>
          </div>
        </Dialog>
      </Box>
      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} />
      {/* )} */}
    </Box>
  );
}

export default HFModalMapCellEditor;
