import RowClickButton from "../RowClickButton";
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
      {props?.colDef?.colIndex === 0 && <RowClickButton />}
    </>
  );
};

export default HFMultiImageCellEditor;
