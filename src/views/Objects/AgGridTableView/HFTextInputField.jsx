import {Box, TextField} from "@mui/material";
import RowClickButton from "./RowClickButton";
import React from "react";

const HFTextInputField = (props) => {
  const {value, setValue, colDef, data} = props;

  const disabled = colDef?.disabled;
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
      <TextField
        size="small"
        disabled={disabled}
        value={value}
        fullWidth
        onChange={(e) => setValue(e.target.value)}
        sx={{
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
        className="custom_textfield_new"
        InputProps={{
          endAdornment: disabled && (
            <img src="/table-icons/lock.svg" alt="lock" />
          ),
        }}
      />
      <RowClickButton onRowClick={onNavigateToDetail} />
    </Box>
  );
};

export default React.memo(HFTextInputField);
