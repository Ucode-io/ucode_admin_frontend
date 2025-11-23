import {Switch, ChakraProvider} from "@chakra-ui/react";
import {useId} from "react";

const HFSwitch = ({
  label,
  tabIndex,
  isBlackBg,
  labelProps,
  isShowLabel = true,
  newColumn,
  drawerDetail = false,
  row,
  handleChange,
  ...props
}) => {
  const id = useId();

  const onChange = (value) => {
    handleChange({
      value,
      rowId: row?.guid,
      name: row?.slug,
    });
  };

  const value = row?.[row?.slug];

  return (
    <div
      style={{
        background: isBlackBg ? "#2A2D34" : "",
        color: isBlackBg ? "#fff" : "",
        paddingLeft: drawerDetail ? "10px" : "4px",
      }}
    >
      <ChakraProvider>
        <Switch
          id={`switch_${newColumn ? "new" : row?.slug}`}
          {...props}
          autoFocus={tabIndex === 1}
          tabIndex={tabIndex}
          isChecked={value || false}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
        />
      </ChakraProvider>
      {isShowLabel && (
        <label htmlFor={`switch-${id}`} {...labelProps}>
          {label}
        </label>
      )}
    </div>
  );
};

export default HFSwitch;
