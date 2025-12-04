import {Switch, ChakraProvider} from "@chakra-ui/react";
import { useId, useState } from "react";

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

  const value = row?.value;
  const [checked, setChecked] = useState(value);

  const onChange = (e) => {
    const value = e.target.checked;
    setChecked(value);
    handleChange({
      value,
      rowId: row?.guid,
      name: row?.slug,
    });
  };

  return (
    <div
      style={{
        background: isBlackBg ? "#2A2D34" : "",
        color: isBlackBg ? "#fff" : "",
        paddingLeft: drawerDetail ? "10px" : "4px",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={`switch-${id}`}
      />
      {/* <ChakraProvider>
        <Switch
          id={`switch_${newColumn ? "new" : row?.slug}`}
          {...props}
          autoFocus={tabIndex === 1}
          tabIndex={tabIndex}
          isChecked={checked}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
        />
      </ChakraProvider> */}
      {isShowLabel && (
        <label htmlFor={`switch-${id}`} {...labelProps}>
          {label}
        </label>
      )}
    </div>
  );
};

export default HFSwitch;
