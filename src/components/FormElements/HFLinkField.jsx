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

const HFLinkField = ({
  watch,
  field,
  control,
  disabled,
  tabIndex,
  isBlackBg,
  name = "",
  rules = {},
  inputHeight,
  placeholder,
  endAdornment,
  setFormValue,
  exist = false,
  required = false,
  withTrim = false,
  fullWidth = false,
  defaultValue = "",
  checkRequiredField,
  isFormEdit = false,
  isNewTableView = false,
  updateObject = () => {},
  customOnChange = () => {},
  disabledHelperText = false,
  disabled_text = "This field is disabled for this role!",
  ...props
}) => {
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
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <TextField
            size="small"
            value={value}
            onChange={(e) => {
              onChange(
                withTrim
                  ? e.target.value?.trim()
                  : typeof e.target.value === "number"
                    ? numberWithSpaces(e.target.value)
                    : e.target.value
              );
              customOnChange(e);
              isNewTableView && updateObject();
            }}
            sx={{
              width: "100%",
              padding: "0px",
              margin: "0px",
              border: "none",
              borderRadius: "8px",
            }}
            name={name}
            id={field?.slug ? `${field?.slug}_${name}` : `${name}`}
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
                    <LaunchIcon style={{fontSize: "20px", color: "#007Aff"}} />
                  </button>
                </InputAdornment>
              ),
            }}
            helperText={!disabledHelperText && error?.message}
            className={isFormEdit ? "custom_textfield" : ""}
            {...props}
          />
        );
      }}
    />
  );
};

export default HFLinkField;
