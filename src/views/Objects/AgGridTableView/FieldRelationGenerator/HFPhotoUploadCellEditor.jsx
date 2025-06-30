import React from "react";
import ImageUploadCellEditor from "./ImageComponents/ImageUploadCellEditor";
import RowClickButton from "../RowClickButton";
import {Box} from "@mui/material";

export default function HFPhotoUploadCellEditor(props) {
  const {field, value, setValue, data, colDef} = props;

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#0000",

        "&:hover .rowClickButton": {
          display: "block",
        },
      }}>
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
      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} />
      {/* )} */}
    </Box>
  );
}
