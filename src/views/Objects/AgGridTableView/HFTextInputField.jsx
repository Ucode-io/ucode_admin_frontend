import {Box, Button, TextField} from "@mui/material";
import styles from "./style.module.scss";
import RowClickButton from "./RowClickButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const HFTextInputField = (props) => {
  const {value, setValue, colDef, data} = props;
  const field = props?.colDef?.fieldObj;
  const view = colDef?.view;

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };

  const disabled =
    field?.attributes?.disabled ||
    !field?.attributes?.field_permission?.edit_permission;

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
          endAdornment: disabled ? (
            <img src="/table-icons/lock.svg" alt="lock" />
          ) : (
            ""
          ),
        }}
      />

      {/* {colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} />
      {/* )} */}
    </Box>
  );
};

export default HFTextInputField;
