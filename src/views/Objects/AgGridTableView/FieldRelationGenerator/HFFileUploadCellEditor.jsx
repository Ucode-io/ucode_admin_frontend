import RowClickButton from "../RowClickButton.jsx";
import NewFileUploadCellEditor from "./ImageComponents/NewFileUploadCellEditor.jsx";

const HFFileUploadCellEditor = (props) => {
  const {field, value, setValue, colDef, data} = props;

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };

  return (
    <>
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
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} />
      )}
    </>
  );
};

export default HFFileUploadCellEditor;
