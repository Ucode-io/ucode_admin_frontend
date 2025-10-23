import {FormHelperText} from "@mui/material";
import React, { useState } from "react";
import ImageUpload from "../Upload/ImageUpload";

export default function HFPhotoUpload({
  name,
  tabIndex,
  isNewTableView = false,
  disabledHelperText = false,
  disabled,
  field,
  drawerDetail = false,
  handleChange = () => {},
  row,
  ...props
}) {

  const [error] = useState()

  const onChange = (value) => {
    handleChange({
      value,
      rowId: row?.guid,
      name: field?.slug
    })
  }

  return (
    <>
      <ImageUpload
        drawerDetail={drawerDetail}
        name={name}
        value={row?.[field?.slug]}
        tabIndex={tabIndex}
        field={field}
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
