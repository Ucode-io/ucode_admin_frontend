import {InputAdornment, TextField, Tooltip} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  input: {
    padding: "0px",
    "&::placeholder": {
      color: "#667085",
    },
  },
}));

const HFTextFieldPassword = ({
  control,
  name = "",
  required = false,
  fullWidth = false,
  rules = {},
  defaultValue = "",
  disabled = false,
  tabIndex,
  placeholder,
  customOnChange = () => {},
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

  const passwordRules = {
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
    validate: {
      hasCapital: (value) =>
        /[A-Z]/.test(value) || "Password must have at least one capital letter",
      hasSmallLetter: (value) =>
        /[a-z]/.test(value) ||
        "Password must have at least one lowercase letter",
      hasNumber: (value) =>
        /[0-9]/.test(value) || "Password must have at least one number",
      hasSymbol: (value) =>
        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
        "Password must have at least one special character",
    },
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: "This is a required field",
        ...passwordRules,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        console.log({ error });
        return (
          <TextField
            size="small"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              customOnChange(e);
            }}
            name={name}
            error={!!error}
            // helperText={error?.message}
            type="password"
            fullWidth={fullWidth}
            placeholder={placeholder}
            InputProps={{
              endAdornment: error && (
                <InputAdornment position="start">
                  <img src="/img/alert-circle.svg" height={"23px"} alt="" />
                </InputAdornment>
                // <Tooltip title={error?.message}>

                // </Tooltip>
              ),
              ...props?.InputProps,
              readOnly: disabled,
              inputProps: {
                tabIndex,
                style: { height: "44px" },
              },
              classes: {
                input: classes.input,
              },
            }}
            className="loginField"
          />
        );
      }}
    />
  );
};

export default HFTextFieldPassword;
