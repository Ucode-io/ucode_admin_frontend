import {Box} from "@mui/material";
import RowClickButton from "../RowClickButton";
import VideoUploadCellEditor from "./ImageComponents/VideoUploadCellEditor";
import React from "react";

const HFVideoUploadCellEditor = (props) => {
  const { setValue, value, data, colDef} = props;
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
      <VideoUploadCellEditor
        value={value}
        onChange={(val) => {
          setValue(val);
        }}
        disabled={disabled}
      />

      <RowClickButton onRowClick={onNavigateToDetail} />
    </Box>
  );
};

export default React.memo(HFVideoUploadCellEditor);
