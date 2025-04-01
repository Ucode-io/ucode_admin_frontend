import { Checkbox } from "@mui/material";
import { Controller } from "react-hook-form";
import { CustomCheckbox } from "../../../../../components/CustomCheckbox";

const PermissionCheckbox = ({
  control,
  required = false,
  name,
  inputProps = {},
  disabled = false,
  inputLeftElement,
  defaultValue = false,
  children,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <CustomCheckbox
          isInvalid={error}
          onChange={(e) => onChange(e.target.checked ? "Yes" : "No")}
          checked={value === "Yes"}
          {...props}
        >
          {children}
        </CustomCheckbox>
      )}
    />
  );
};

export default PermissionCheckbox;
