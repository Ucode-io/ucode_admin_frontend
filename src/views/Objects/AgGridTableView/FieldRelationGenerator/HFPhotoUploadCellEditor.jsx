import React from "react";
import ImageUploadCellEditor from "./ImageComponents/ImageUploadCellEditor";
import RowClickButton from "../RowClickButton";

export default function HFPhotoUploadCellEditor(props) {
  const {field, value, setValue, data, colDef} = props;

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };
  return (
    <>
      <ImageUploadCellEditor
        value={value}
        field={field}
        onChange={(val) => {
          setValue(val);
        }}
        disabled={field?.attributes?.disabled}
        {...props}
      />
      {/* {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )} */}
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} />
      )}
    </>
  );
}
