import RowClickButton from "../RowClickButton.jsx";
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
      {props?.colDef?.colIndex === 0 && <RowClickButton />}
    </>
  );
};

export default HFFileUploadCellEditor;
