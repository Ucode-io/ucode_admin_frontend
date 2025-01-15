import {useEffect} from "react";
import {makeStyles} from "@mui/styles";
import styles from "./style.module.scss";
import {Controller} from "react-hook-form";
import {useLocation} from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import {numberWithSpaces} from "@/utils/formatNumbers";
import {InputAdornment, TextField} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  input: {
    padding: "0px",
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFLinkFieldEditor = (props) => {
  const {value, setValue, isNewTableView = false} = props;
  const location = useLocation();
  const classes = useStyles();
  useEffect(() => {
    if (
      location.pathname?.includes("create") &&
      location?.state?.isTreeView === true
    ) {
      setFormValue(name, "");
    }
  }, []);

  const navigateToNewPage = (url, target = "_blank") => {
    if (!url) return;
    window.open(url, target);
  };

  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      sx={{
        width: "100%",
        padding: "0px",
        margin: "0px",
        border: "none",
        borderRadius: "8px",
      }}
      name={name}
      error={error}
      fullWidth={fullWidth}
      placeholder={placeholder}
      autoFocus={tabIndex === 1}
      InputProps={{
        readOnly: disabled,
        inputProps: {tabIndex, style: {height: inputHeight}},
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

        endAdornment: (
          <InputAdornment position="start">
            <button
              disabled={Boolean(!value)}
              className={styles.linkBtn}
              onClick={() => navigateToNewPage(value)}
              sx={{cursor: "pointer"}}>
              <LaunchIcon style={{fontSize: "20px"}} />
            </button>
          </InputAdornment>
        ),
      }}
      className={"customLinkField"}
      {...props}
    />
  );
};

export default HFLinkFieldEditor;
