import {FormHelperText} from "@mui/material";
import IconPicker from "../IconPicker";
import { useState } from "react";

const HFIconPicker = ({
  tabIndex,
  disabledHelperText = false,
  disabled = false,
  shape,
  row,
  field,
  handleChange,
  ...props
}) => {

  const [error, setError] = useState({})

  const value = row?.[field?.slug]

  const onChange = (value) => {
    handleChange({
      value,
      name: field?.slug,
      rowId: row?.guid,
    })
  }

  return (
    <>
      <IconPicker
        id="icon_field"
        disabled={disabled}
        value={value}
        tabIndex={tabIndex}
        shape={shape}
        onChange={onChange}
        {...props}
      />
      {!disabledHelperText && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )}
    </>
  );
};

export default HFIconPicker;
