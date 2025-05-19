import {Box} from "@mui/material";
import RowClickButton from "../RowClickButton";
import VideoUploadCellEditor from "./ImageComponents/VideoUploadCellEditor";

const HFVideoUploadCellEditor = (props) => {
  const {setValue, value, data, colDef} = props;

  const field = props?.colDef?.fieldObj;

  const disabled =
    field?.attributes?.disabled ||
    !field?.attributes?.field_permission?.edit_permission;

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
      {/* {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )} */}

      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} />
      {/* )} */}
    </Box>
  );
};

export default HFVideoUploadCellEditor;
