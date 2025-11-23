import ColorPicker from "../ColorPicker";
import { useState } from "react";

const HFColorPicker = ({ disabled = false, row, handleChange, ...props }) => {
  const [value, setValue] = useState(row?.value);
  const [error] = useState({});

  const onChange = (value) => {
    setValue(value);
    handleChange({
      value,
      name: row?.slug,
      rowId: row?.guid,
    });
  };

  return (
    <ColorPicker
      disabled={disabled}
      error={error}
      value={value}
      onChange={(val) => {
        onChange(val);
      }}
      {...props}
    />
  );
};

export default HFColorPicker;
