import {Switch, ChakraProvider} from "@chakra-ui/react";
import {useId} from "react";
import {Controller} from "react-hook-form";

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
            className={!disabledHelperText ? "mb-1" : ""}
            style={{
              background: isBlackBg ? "#2A2D34" : "",
              color: isBlackBg ? "#fff" : "",
              paddingLeft: "4px"
            }}>
            <ChakraProvider>
              <Switch
                size='lg'
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
