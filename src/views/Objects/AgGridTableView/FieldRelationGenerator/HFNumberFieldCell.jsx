import {NumericFormat} from "react-number-format";
import RowClickButton from "../RowClickButton";
import {Box} from "@mui/material";

const HFNumberFieldCell = (props) => {
  const {value, setValue, colDef, data} = props;
  const field = props?.colDef?.fieldObj;

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#0000",

        "&:hover .rowClickButton": {
          display: "block",
        },
      }}>
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
      {/* {colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} />
      {/* )} */}
    </Box>
  );
};

export default HFNumberFieldCell;
