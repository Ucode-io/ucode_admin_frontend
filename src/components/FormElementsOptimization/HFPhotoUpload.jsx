import {FormHelperText} from "@mui/material";
import React, { useState } from "react";
import ImageUpload from "../Upload/ImageUpload";

export default function HFPhotoUpload({
  name,
  tabIndex,
  isNewTableView = false,
  disabledHelperText = false,
  disabled,
  drawerDetail = false,
  handleChange = () => {},
  row,
  ...props
}) {
  const [error] = useState();

  const onChange = (value) => {
    handleChange({
      value,
      rowId: row?.guid,
      name: row?.slug,
    });
  };

  return (
    <>
      <ImageUpload
        drawerDetail={drawerDetail}
        name={name}
        value={row?.value}
        tabIndex={tabIndex}
        field={row}
        isNewTableView={isNewTableView}
        onChange={(val) => {
          onChange(val);
          // isNewTableView && updateObject();
        }}
        disabled={disabled}
        {...props}
      />
      {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )}
    </>
  );
}
