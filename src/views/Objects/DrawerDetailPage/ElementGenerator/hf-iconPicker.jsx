import {FormHelperText} from "@mui/material";
import {Controller} from "react-hook-form";
import IconPickerField from "./IconPickerField";
import { Box } from "@chakra-ui/react";
import { Lock } from "@mui/icons-material";

const HFIconPicker = ({
  control,
  tabIndex,
  name,
  disabledHelperText = false,
  required = false,
  rules = {},
  updateObject,
  isNewTableView = false,
  disabled = false,
  customeClick = false,
  clickItself = () => {},
  drawerDetail = false,
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
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box>
          <IconPickerField
            drawerDetail={drawerDetail}
            id="icon_field"
            disabled={disabled}
            error={error}
            value={value}
            tabIndex={tabIndex}
            onChange={(val) => {
              onChange(val);
            }}
            customeClick={customeClick}
            clickItself={clickItself}
            {...props}
          />
          {!disabledHelperText && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </Box>
      )}
    ></Controller>
  );
};

export default HFIconPicker;
