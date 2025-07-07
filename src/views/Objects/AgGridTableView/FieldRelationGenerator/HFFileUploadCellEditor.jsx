import {Box} from "@mui/material";
import RowClickButton from "../RowClickButton.jsx";
import NewFileUploadCellEditor from "./ImageComponents/NewFileUploadCellEditor.jsx";
import React from "react";

const HFFileUploadCellEditor = (props) => {
  const {field, value, setValue, colDef, data} = props;

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
      <NewFileUploadCellEditor
        value={value}
        field={field}
        onChange={(val) => {
          setValue(val);
        }}
        disabled={field?.attributes?.disabled}
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

export default React.memo(HFFileUploadCellEditor);
