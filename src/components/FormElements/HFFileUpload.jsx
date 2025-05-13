import {FormHelperText} from "@mui/material";
import {Controller} from "react-hook-form";
import NewFileUpload from "../Upload/NewFileUpload.jsx";

const HFFileUpload = ({
  name,
  rules,
  field,
  control,
  required,
  tabIndex,
  disabled,
  drawerDetail = false,
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
          <NewFileUpload
            name={name}
            value={value}
            drawerDetail={drawerDetail}
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

export default HFFileUpload;
