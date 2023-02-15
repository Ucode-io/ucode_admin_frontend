import { TextField } from "@mui/material";
import { Controller, useWatch } from "react-hook-form";
import {numberWithSpaces} from "@/utils/formatNumbers";

const HFNumberField = ({
  control,
  name = "",
  disabledHelperText = false,
  isBlackBg = false,
  isFormEdit = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
    tabIndex,
  disabled,
  type='text',
  ...props
}) => {
  const value = useWatch({
    control,
    // name,
  });

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        console.log("SSSSSSS ===>", value)
        return (
          <TextField
            size="small"
            value={numberWithSpaces(value)}
            onChange={(e) => {
              const val = e.target.value;
              const valueWithoutSpaces = val.replaceAll(' ', '')
              
              if (!valueWithoutSpaces) onChange('');
              else {
                if(valueWithoutSpaces.at(-1) === '.') onChange(valueWithoutSpaces)
                else onChange(!isNaN(Number(valueWithoutSpaces)) ? Number(valueWithoutSpaces) : '');}
            }}
            className={`${isFormEdit ? "custom_textfield" : ""}`}
            name={name}
            error={error}
            fullWidth={fullWidth}
            helperText={!disabledHelperText && error?.message}
            autoFocus={tabIndex === 1}
            InputProps={{
              inputProps: { tabIndex },
              readOnly: disabled,
              style: disabled
                ? {
                    background: "#c0c0c039",
                  }
                : {
                    background: isBlackBg ? "#2A2D34" : "",
                    color: isBlackBg ? "#fff" : "",
                  },
            }}
            {...props}
          />
        )
      }}
    ></Controller>
  );
};

export default HFNumberField;
