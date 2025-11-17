import LaunchIcon from "@mui/icons-material/Launch";
import {Box, InputAdornment, TextField} from "@mui/material";
import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import RowClickButton from "../RowClickButton";
import styles from "./style.module.scss";

const HFLinkFieldEditor = (props) => {
  const {value, setValue, colDef, data} = props;
  const location = useLocation();
  const disabled = colDef?.disabled;

  useEffect(() => {
    if (
      location.pathname?.includes("create") &&
      location?.state?.isTreeView === true
    ) {
      setValue("");
    }
  }, []);

  const navigateToNewPage = (url, target = "_blank") => {
    if (!url) return;
    window.open(url, target);
  };

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
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        fullWidth
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
        InputProps={{
          readOnly: disabled,
          inputProps: {style: {height: "32px"}},

          endAdornment: (
            <InputAdornment position="start">
              {disabled ? (
                <button style={{width: "20px", height: "20px"}}>
                  <img
                    src="/table-icons/lock.svg"
                    alt="lock"
                    style={{width: "20px", height: "20px"}}
                  />
                </button>
              ) : (
                <button
                  style={{marginRight: "10px"}}
                  disabled={Boolean(!value)}
                  className={styles.linkBtn}
                  onClick={() => navigateToNewPage(value)}
                  sx={{cursor: "pointer"}}>
                  <LaunchIcon style={{fontSize: "20px"}} />
                </button>
              )}
            </InputAdornment>
          ),
        }}
        className={"custom_textfield_new"}
        {...props}
      />
      <RowClickButton onRowClick={onNavigateToDetail} />
    </Box>
  );
};

export default React.memo(HFLinkFieldEditor);
