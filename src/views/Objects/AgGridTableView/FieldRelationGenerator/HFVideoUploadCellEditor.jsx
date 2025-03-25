import RowClickButton from "../RowClickButton";
import VideoUploadCellEditor from "./ImageComponents/VideoUploadCellEditor";

const HFVideoUploadCellEditor = (props) => {
  const {field, setValue, value} = props;
  return (
    <>
      <VideoUploadCellEditor
        value={value}
        onChange={(val) => {
          setValue(val);
        }}
        disabled={field?.disabled}
      />
      {/* {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )} */}

      {props?.colDef?.colIndex === 0 && <RowClickButton />}
    </>
  );
};

export default HFVideoUploadCellEditor;
