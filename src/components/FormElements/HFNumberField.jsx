import { Controller, useWatch } from "react-hook-form";
import { NumericFormat } from 'react-number-format';
import styles from './style.module.scss';
import { Box } from "@mui/material";

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
  type = 'text',
  ...props
}) => {
  const value = useWatch({
    control,
    name,
  });

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <Box style={disabled ? { background: "#DEDEDE", display: "flex", borderRadius: "4px" } : { background: isBlackBg ? "#2A2D34" : "", color: isBlackBg ? "#fff" : "" }}>
            <NumericFormat
              thousandsGroupStyle="thousand"
              thousandSeparator=" "
              decimalSeparator="."
              displayType="input"
              isNumericString={true}
              autoComplete="off"
              allowNegative
              fullWidth={fullWidth}
              value={value}
              onChange={(e) => {
                const val = e.target.value;
                const valueWithoutSpaces = val.replaceAll(" ", "");
                if (!valueWithoutSpaces) {
                  onChange("");
                } else {
                  if (valueWithoutSpaces.endsWith(".")) {
                    onChange(valueWithoutSpaces);
                  } else {
                    onChange(!isNaN(Number(valueWithoutSpaces)) ? Number(valueWithoutSpaces) : "");
                  }
                }
              }}
              className={`${isFormEdit ? "custom_textfield" : ""} ${styles.numberField}`}
              name={name}
              readOnly={disabled}
              style={disabled ? { background: "#c0c0c039" } : { background: isBlackBg ? "#2A2D34" : "", color: isBlackBg ? "#fff" : "" }}
              {...props}
            />
          </Box>
        );
      }}
    ></Controller>
  );
};

export default HFNumberField;
