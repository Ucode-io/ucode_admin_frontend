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
    </>
  );
};

export default HFVideoUploadCellEditor;
