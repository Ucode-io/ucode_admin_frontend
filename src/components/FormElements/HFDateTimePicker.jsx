import { Controller } from "react-hook-form";
import CDateTimePicker from "../DatePickers/CDateTimePicker";

const HFDateTimePicker = ({
  control,
  isBlackBg = false,
  className,
  name,
  label,
  width,
  showCopyBtn,
  inputProps,
  disabledHelperText,
  placeholder,
  disabled,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <CDateTimePicker
            isBlackBg={isBlackBg}
            value={value}
            showCopyBtn={showCopyBtn}
            onChange={onChange}
            disabled={disabled}
          />
        );
      }}
    ></Controller>
  );
};

export default HFDateTimePicker;
