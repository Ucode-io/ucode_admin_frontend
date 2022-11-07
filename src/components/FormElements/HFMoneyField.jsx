import { placeholder } from "@codemirror/view";
import CurrencyInput from "react-currency-input-field";
import { Controller } from "react-hook-form";
import cls from "./style.module.scss";

const HFMoneyField = ({
  control,
  name = "",
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled,
  ...props
}) => {
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
        <CurrencyInput
          value={value}
          className={cls.moneyInput}
          placeholder={placeholder}
          defaultValue={defaultValue}
          decimalsLimit={2}
          onValueChange={(value, name) => {
            onChange(value);
            console.log(value, name);
          }}
          {...props}
        />
      )}
    ></Controller>
  );
};

export default HFMoneyField;
