import {InputAdornment, TextField} from "@mui/material";
import {makeStyles} from "@mui/styles";
import React from "react";
import {Controller} from "react-hook-form";
import styles from "./style.module.scss";
import LaunchIcon from "@mui/icons-material/Launch";

const useStyles = makeStyles((theme) => ({
  input: {
    padding: "0px",
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

function HFMoneyField({
  name,
  control,
  updateObject = () => {},
  tabIndex = 0,
  disabled = false,
  isBlackBg = false,
  isNewTableView = false,
}) {
  const classes = useStyles();
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <TextField
            fullWidth
            value={value}
            className="customLinkField"
            sx={{
              width: "100%",
              padding: "0px",
              margin: "0px",
              border: "none",
              borderRadius: "8px",
            }}
            InputProps={{
              readOnly: disabled,
              inputProps: {tabIndex, style: {height: "0px"}},
              classes: {
                input: isBlackBg ? classes.input : "",
              },
              style: disabled
                ? {
                    background: "#c0c0c039",
                    padding: "0px",
                  }
                : isNewTableView
                  ? {
                      background: "inherit",
                      color: "inherit",
                      padding: "0px !important",
                      margin: "0px !important",
                      height: "25px",
                    }
                  : {},

              //   endAdornment: (
              //     <InputAdornment position="start">
              //       <button
              //         disabled={Boolean(!value)}
              //         className={styles.linkBtn}
              //         onClick={() => navigateToNewPage(value)}
              //         sx={{cursor: "pointer"}}>
              //         <LaunchIcon style={{fontSize: "20px"}} />
              //       </button>
              //     </InputAdornment>
              //   ),
            }}
          />
        );
      }}
    />
  );
}

export default HFMoneyField;
