import {NumericFormat} from "react-number-format";
import RowClickButton from "../RowClickButton";
import {Box} from "@mui/material";

const HFNumberFieldCell = (props) => {
  const {value, setValue, colDef} = props;
  const field = props?.colDef?.fieldObj;

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };
  return (
    <>
      <NumericFormat
        disabled={field?.attributes?.disabled}
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
      {field?.attributes?.disabled && (
        <Box sx={{position: "absolute", right: "14px", top: "6px"}}>
          <img src="/table-icons/lock.svg" alt="lock" />
        </Box>
      )}
      {colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} />
      )}
    </>
  );
};

export default HFNumberFieldCell;
