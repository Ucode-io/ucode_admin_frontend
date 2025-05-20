import {Box} from "@mui/material";
import RowClickButton from "../RowClickButton";
import MultiImageUploadCellEditor from "./ImageComponents/MultiImageUploadCellEditor";
import MultiFileUploadCellEditor from "./ImageComponents/MultiFileUploadCellEditor";

const HFMultiFileCellEditor = (props) => {
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
      <MultiFileUploadCellEditor
        isTableView={true}
        value={value ?? []}
        onChange={setValue}
        field={field}
        disabled={disabled}
      />

      <RowClickButton onRowClick={onNavigateToDetail} />
    </Box>
  );
};

export default HFMultiFileCellEditor;
