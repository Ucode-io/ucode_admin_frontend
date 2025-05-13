import {Controller} from "react-hook-form";
import ColorPicker from "../ColorPicker";

const HFColorPicker = ({
  control,
  name,
  disabledHelperText = false,
  required = false,
  updateObject,
  isNewTableView = false,
  rules = {},
  customeClick = false,
  clickItself = () => {},
  disabled = false,
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
          <ColorPicker
            disabled={disabled}
            error={error}
            value={value}
            onChange={(val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            customeClick={customeClick}
            clickItself={clickItself}
            {...props}
          />
        </>
      )}></Controller>
  );
};

export default HFColorPicker;
