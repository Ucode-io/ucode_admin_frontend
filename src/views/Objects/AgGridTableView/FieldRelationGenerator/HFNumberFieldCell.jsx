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
      onChange={(e) => {
        const trimmedValue = e.target.value.replace(/\s/g, "");
        setValue(Number(trimmedValue));
      }}
      className="custom_number_field"
    />
  );
};

export default HFNumberFieldCell;
