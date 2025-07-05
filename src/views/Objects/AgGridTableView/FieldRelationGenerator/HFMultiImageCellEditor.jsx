import {Box} from "@mui/material";
import RowClickButton from "../RowClickButton";
import MultiImageUploadCellEditor from "./ImageComponents/MultiImageUploadCellEditor";
import React from "react";

const HFMultiImageCellEditor = (props) => {
  const {setValue, value, data, colDef} = props;
  const disabled = colDef?.disabled;

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
      <MultiImageUploadCellEditor
        value={value ?? []}
        onChange={setValue}
        disabled={disabled}
      />
      {/* {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )} */}
      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} />
      {/* )} */}
    </Box>
  );
};

export default React.memo(HFMultiImageCellEditor);
