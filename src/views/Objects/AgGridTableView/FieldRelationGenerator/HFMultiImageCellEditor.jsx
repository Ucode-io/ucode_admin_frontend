import MultiImageUploadCellEditor from "./ImageComponents/MultiImageUploadCellEditor";

const HFMultiImageCellEditor = (props) => {
  const {field, setValue, value} = props;
  return (
    <>
      <MultiImageUploadCellEditor
        value={value}
        onChange={setValue}
        field={field}
        disabled={field?.disabled}
      />
      {/* {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )} */}
    </>
  );
};

export default HFMultiImageCellEditor;
