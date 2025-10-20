import ColorPicker from "../ColorPicker";
import { useState } from "react";

const HFColorPicker = ({
  disabled = false,
  field,
  row,
  handleChange,
  ...props
}) => {

  const [value, setValue] = useState(row?.[field?.slug]);
  const [error] = useState({});

  const onChange = (value) => {
    setValue(value)
    handleChange({
      value,
      name: field?.slug,
      rowId: row?.guid
    })
  }

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
