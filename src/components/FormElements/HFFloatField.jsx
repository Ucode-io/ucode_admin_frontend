import { Controller, useWatch } from "react-hook-form";
import { NumericFormat } from 'react-number-format';
import styles from './style.module.scss'

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
  isFloat = false, // new prop to indicate whether this is a float field
  decimalScale = 2, // new prop to set the number of decimal places
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
        const allowNegative = isFloat; // allow negatives only for float fields
        const decimalSeparator = isFloat ? '.' : undefined; // set the decimal separator only for float fields

        return (
          <NumericFormat
            thousandsGroupStyle="thousand"
            thousandSeparator=" "
            decimalSeparator={decimalSeparator}
            decimalScale={decimalScale}
            displayType="input"
            isNumericString={true}
            autoComplete="off"
            allowNegative={allowNegative}
            fullWidth={fullWidth}
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              const valueWithoutSpaces = val.replaceAll(' ', '')
              
              if (!valueWithoutSpaces) onChange('');
              else {
                if(valueWithoutSpaces.at(-1) === '.') onChange(valueWithoutSpaces)
                else onChange(!isNaN(Number(valueWithoutSpaces)) ? Number(valueWithoutSpaces) : '')}
                }}
              className={`${isFormEdit ? "custom_textfield" : ""} ${styles.numberField}`}
              name={name}
              readOnly={disabled}
              style={disabled ? { background: "#c0c0c039" } : { background: isBlackBg ? "#2A2D34" : "", color: isBlackBg ? "#fff" : "" }}
              {...props}
            />
        )
      }}
    ></Controller>
  );
};

export default HFNumberField;
