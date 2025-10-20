import {useEffect, useState} from "react";
import {makeStyles} from "@mui/styles";
import styles from "./style.module.scss";
import {useLocation} from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import {numberWithSpaces} from "@/utils/formatNumbers";
import {InputAdornment, TextField} from "@mui/material";
import {Box} from "@chakra-ui/react";
import {Lock} from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  input: {
    padding: "0px",
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFLinkField = ({
  field,
  disabled,
  tabIndex,
  isBlackBg,
  name = "",
  inputHeight,
  placeholder = "",
  setFormValue,
  required = false,
  withTrim = false,
  fullWidth = false,
  drawerDetail = false,
  isNewTableView = false,
  disabledHelperText = false,
  handleChange = () => {},
  row,
  ...props
}) => {
  const location = useLocation();
  const classes = useStyles();

  const innerValue = row?.[field?.slug]

  const [error, setError] = useState({});

  const handleBlur = (e) => {
    const value = withTrim
      ? e.target.value?.trim()
      : typeof e.target.value === "number"
        ? numberWithSpaces(e.target.value)
        : e.target.value


    if(required && !value?.trim()) {
      setError({
        message: "This field is required",
      })
    } else {
      setError({})
    }

    handleChange({
      value,
      name: field?.slug,
      rowId: row?.guid,
    })
  }

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
      <>

      <TextField
              size="small"
              defaultValue={innerValue}
              onBlur={handleBlur}
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
                  style: {height: inputHeight, color: "blue"},
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
                    {Boolean(innerValue) ? (
                      <button
                        disabled={Boolean(!innerValue)}
                        className={styles.linkBtn}
                        onClick={() => navigateToNewPage(innerValue)}
                        style={{cursor: "pointer"}}>
                        <LaunchIcon style={{fontSize: "20px"}} />
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
      
      </>
      {/* <Controller
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
                  style: {height: inputHeight, color: "blue"},
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
                        sx={{cursor: "pointer"}}>
                        <LaunchIcon style={{fontSize: "20px"}} />
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
      /> */}
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
            }}>
            <Lock style={{fontSize: "20px", color: "#adb5bd"}} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HFLinkField;
