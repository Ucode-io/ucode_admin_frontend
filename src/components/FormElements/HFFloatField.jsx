import { Controller, useWatch } from "react-hook-form";
import { NumericFormat } from 'react-number-format';
import styles from './style.module.scss'

const HFFloatField = ({
  control,
  name = "",
  disabledHelperText = false,
  isBlackBg = false,
  isFormEdit = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  field,
  rules = {},
  defaultValue = "",
  tabIndex,
  disabled,
  type='text',
  isFloat = false, 
  decimalScale = 2, 
  ...props
}) => {

  const decimal = field?.attributes?.number_of_rounds ? field?.attributes?.number_of_rounds : decimalScale
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
        const allowNegative = isFloat; 
        const decimalSeparator = isFloat ? '.' : undefined;

        return (
          <NumericFormat
            thousandsGroupStyle="thousand"
            thousandSeparator=" "
            decimalSeparator={decimalSeparator}
            decimalScale={decimal}
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
                if(valueWithoutSpaces.at(-1) === '.') onChange(parseInt(valueWithoutSpaces))
                else onChange(!isNaN(valueWithoutSpaces) ? parseInt(valueWithoutSpaces) : valueWithoutSpaces)}
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

export default HFFloatField;
