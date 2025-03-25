import {NumericFormat} from "react-number-format";
import RowClickButton from "../RowClickButton";

const HFNumberFieldCell = (props) => {
  const {value, setValue, colDef} = props;
  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };
  return (
    <>
      <NumericFormat
        size="small"
        thousandsGroupStyle="thousand"
        thousandSeparator=" "
        decimalSeparator="."
        value={value}
        fullWidth
        onChange={(e) => {
          const trimmedValue = e.target.value.replace(/\s/g, "");
          setValue(Number(trimmedValue));
        }}
        className="custom_number_field"
      />
      {colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} />
      )}
    </>
  );
};

export default HFNumberFieldCell;
