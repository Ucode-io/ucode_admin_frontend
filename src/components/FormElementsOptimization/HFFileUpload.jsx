import {FormHelperText} from "@mui/material";
import NewFileUpload from "../Upload/NewFileUpload.jsx";
import { useState } from "react";

const HFFileUpload = ({
  tabIndex,
  disabled,
  drawerDetail = false,
  disabledHelperText = false,
  handleChange,
  row,
  ...props
}) => {
  const [error] = useState({});

  const onChange = (value) => {
    handleChange({
      value,
      name: row?.slug,
      rowId: row?.guid,
    });
  };

  return (
    <>
      <NewFileUpload
        value={row?.value}
        drawerDetail={drawerDetail}
        tabIndex={tabIndex}
        field={row}
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
