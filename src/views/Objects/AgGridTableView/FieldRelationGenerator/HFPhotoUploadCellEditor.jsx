import React from "react";
import ImageUploadCellEditor from "./ImageComponents/ImageUploadCellEditor";

export default function HFPhotoUploadCellEditor(props) {
  const {field, value, setValue} = props;
  return (
    <>
      <ImageUploadCellEditor
        value={value}
        field={field}
        onChange={(val) => {
          setValue(val);
        }}
        disabled={field?.disabled}
        {...props}
      />
      {/* {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )} */}
    </>
  );
}
