import {FormHelperText} from "@mui/material";
import {Controller} from "react-hook-form";
import TopUpBalance from "../Upload/TopUpBalance.jsx";

const HFBalanceFile = ({
  name,
  rules,
  field,
  control,
  required,
  tabIndex,
  disabled,
  isNewTableView = false,
  updateObject = () => {},
  disabledHelperText = false,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <>
          <TopUpBalance
            name={name}
            value={value}
            tabIndex={tabIndex}
            field={field}
            onChange={(val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            disabled={disabled}
            {...props}
          />
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </>
      )}></Controller>
  );
};

export default HFBalanceFile;
