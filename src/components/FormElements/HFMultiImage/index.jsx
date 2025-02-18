import {FormHelperText} from "@mui/material";
import {Controller} from "react-hook-form";
import MultiImageUpload from "./MultiImageUpload";

const HFMultiImage = ({
  control,
  name,
  tabIndex,
  required,
  rules,
  disabledHelperText = false,
  disabled = false,
  field,
  isTableView = false,
  drawerDetail = false,
  updateObject = () => {},
  newUi,
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
          <MultiImageUpload
            name={name}
            drawerDetail={drawerDetail}
            value={value}
            tabIndex={tabIndex}
            onChange={onChange}
            updateObject={updateObject}
            disabled={disabled}
            field={field}
            isTableView={isTableView}
            newUi={newUi}
            {...props}
          />
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </>
      )}></Controller>
  );
};

export default HFMultiImage;
