import { Lock } from "@mui/icons-material";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";
import InputMask from "react-input-mask";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFTextFieldWithMask = ({
  control,
  name = "",
  isBlackBg = false,
  isFormEdit = false,
  disabledHelperText = false,
  required = false,
  rules = {},
  mask,
  disabled,
  tabIndex,
  placeholder,
  defaultValue,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputMask mask={mask} value={value ?? undefined} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
          {(inputProps) => (
            <TextField
              size="small"
              name={name}
              error={error}
              helperText={!disabledHelperText && error?.message}
              placeholder={placeholder}
              className={isFormEdit ? "custom_textfield" : ""}
              autoFocus={tabIndex === 1}
              {...props}
              InputProps={{
                ...inputProps,
                readOnly: disabled,
                inputProps: { tabIndex },
                classes: {
                  input: isBlackBg ? classes.input : "",
                },
                style: disabled
                  ? {
                      background: "#c0c0c039",
                    }
                  : {
                      background: isBlackBg ? "#2A2D34" : "inherit",
                      color: isBlackBg ? "#fff" : "inherit",
                    },
                startAdornment: disabled && (
                  <Tooltip title="This field is disabled for this role!">
                    <InputAdornment position="start">
                      <Lock style={{ fontSize: "20px" }} />
                    </InputAdornment>
                  </Tooltip>
                ),
              }}
            />
          )}
        </InputMask>
      )}
    ></Controller>
  );
};

export default HFTextFieldWithMask;
