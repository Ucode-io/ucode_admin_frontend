import {FormHelperText} from "@mui/material";
import NewFileUpload from "../Upload/NewFileUpload.jsx";
import { useState } from "react";

const HFFileUpload = ({
  field,
  tabIndex,
  disabled,
  drawerDetail = false,
  disabledHelperText = false,
  handleChange,
  row,
  ...props
}) => {

  const [error] = useState({})

  const onChange = (value) => {
    handleChange({
      value,
      name: field?.slug,
      rowId: row?.guid
    })
  }

  return (
    <>
      <NewFileUpload
        value={row?.[field?.slug]}
        drawerDetail={drawerDetail}
        tabIndex={tabIndex}
        field={field}
        onChange={(val) => {
          onChange(val);
        }}
        disabled={disabled}
        {...props}
      />
      {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )}
    </>
  );
};

export default HFFileUpload;
