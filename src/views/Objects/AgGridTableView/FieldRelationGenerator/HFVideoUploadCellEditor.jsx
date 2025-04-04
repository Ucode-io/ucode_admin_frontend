import RowClickButton from "../RowClickButton";
import VideoUploadCellEditor from "./ImageComponents/VideoUploadCellEditor";

const HFVideoUploadCellEditor = (props) => {
  const {field, setValue, value, data, colDef} = props;

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };
  return (
    <>
      <VideoUploadCellEditor
        value={value}
        onChange={(val) => {
          setValue(val);
        }}
        disabled={field?.attributes?.disabled}
      />
      {/* {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )} */}

      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} />
      )}
    </>
  );
};

export default HFVideoUploadCellEditor;
