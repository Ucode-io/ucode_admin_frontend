import {Switch, ChakraProvider} from "@chakra-ui/react";
import {useId} from "react";
import {Controller} from "react-hook-form";
import useDebounce from "../../hooks/useDebounce";

const HFSwitch = ({
  control,
  name,
  label,
  disabledHelperText,
  tabIndex,
  updateObject,
  isNewTableView = false,
  isBlackBg,
  onChange = () => {},
  labelProps,
  defaultValue = false,
  field,
  isShowLable = true,
  newColumn,
  drawerDetail = false,
  updateObject = () => {},
  ...props
}) => {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({
        field: {onChange: formOnChange, value},
        fieldState: {error},
      }) => {
        return (
          <div
            style={{
              background: isBlackBg ? "#2A2D34" : "",
              color: isBlackBg ? "#fff" : "",
              paddingLeft: drawerDetail ? "10px" : "4px",
            }}>
            <ChakraProvider>
              <Switch
                id={`switch_${newColumn ? "new" : field?.slug}`}
                {...props}
                autoFocus={tabIndex === 1}
                tabIndex={tabIndex}
                isChecked={value || false}
                onChange={(e) => {
                  formOnChange(e.target.checked);
                  onChange(e.target.checked);
                  isNewTableView && updateObject();
                }}
              />
            </ChakraProvider>
            {isShowLable && (
              <label htmlFor={`switch-${id}`} {...labelProps}>
                {label}
              </label>
            )}
          </div>
        );
      }}></Controller>
  );
};

export default HFSwitch;
