import {NumericFormat} from "react-number-format";

const HFNumberFieldCell = (props) => {
  const {value, setValue} = props;

  return (
    <NumericFormat
      size="small"
      thousandsGroupStyle="thousand"
      thousandSeparator=" "
      decimalSeparator="."
      value={value}
      fullWidth
      onChange={(e) => setValue(Number(e.target.value))}
      className="custom_number_field"
    />
  );
};

export default HFNumberFieldCell;
