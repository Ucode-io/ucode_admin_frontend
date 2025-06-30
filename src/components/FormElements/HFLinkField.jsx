import {useEffect} from "react";
import {makeStyles} from "@mui/styles";
import styles from "./style.module.scss";
import {Controller} from "react-hook-form";
import {useLocation} from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import {numberWithSpaces} from "@/utils/formatNumbers";
import {InputAdornment, TextField} from "@mui/material";
import { Box } from "@chakra-ui/react";
import { Lock } from "@mui/icons-material";

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
  drawerDetail = false,
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
    <Box position="relative">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{
          required: required ? "This is required field" : false,
          ...rules,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
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
                width: "335px",
                padding: "0px",
                margin: "0px",
                border: "none",
                borderRadius: "8px",
                "& .MuiInputBase-input::placeholder": {
                  color: "#adb5bd",
                  fontSize: "14px",
                },
                "& input": {
                  cursor: disabled ? "not-allowed" : "pointer",
                },
              }}
              name={name}
              id={field?.slug ? `${field?.slug}_${name}` : `${name}`}
              error={error}
              fullWidth={fullWidth}
              placeholder={placeholder}
              autoFocus={tabIndex === 1}
              InputProps={{
                readOnly: disabled,
                inputProps: {
                  tabIndex,
                  style: { height: inputHeight, color: "blue" },
                },
                classes: {
                  input: isBlackBg ? classes.input : "",
                },
                style: disabled
                  ? {
                      // background: "#f8f8f8",
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
                    {Boolean(value) ? (
                      <button
                        disabled={Boolean(!value)}
                        className={styles.linkBtn}
                        onClick={() => navigateToNewPage(value)}
                        sx={{ cursor: "pointer" }}
                      >
                        <LaunchIcon style={{ fontSize: "20px" }} />
                      </button>
                    ) : (
                      ""
                    )}
                  </InputAdornment>
                ),
              }}
              helperText={!disabledHelperText && error?.message}
              className={
                drawerDetail ? "customLinkFieldDrawer" : "customLinkField"
              }
              {...props}
            />
          );
        }}
      />
      <Box>
        {disabled && (
          <Box
            sx={{
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <Lock style={{ fontSize: "20px", color: "#adb5bd" }} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HFLinkField;
