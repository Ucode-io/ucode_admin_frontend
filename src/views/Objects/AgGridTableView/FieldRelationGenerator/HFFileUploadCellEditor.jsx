import NewFileUploadCellEditor from "./ImageComponents/NewFileUploadCellEditor.jsx";

const HFFileUploadCellEditor = (props) => {
  const {field, value, setValue} = props;
  return (
    <>
      <NewFileUploadCellEditor
        value={value}
        field={field}
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

export default HFFileUploadCellEditor;
