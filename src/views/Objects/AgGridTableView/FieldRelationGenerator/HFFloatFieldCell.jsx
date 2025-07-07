import {NumericFormat} from "react-number-format";
import RowClickButton from "../RowClickButton";
import {Box} from "@mui/material";
import React from "react";

const HFFloatFieldCell = (props) => {
  const {value, setValue, colDef, data} = props;
  const disabled = colDef?.disabled || !colDef?.editPermission;

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
        disabled={disabled}
        size="small"
        thousandsGroupStyle="thousand"
        thousandSeparator=" "
        decimalSeparator="."
        value={value}
        fullWidth
        onChange={(e) => {
          const val = e.target.value;
          const valueWithoutSpaces = val.replaceAll(" ", "");
          if (!valueWithoutSpaces) setValue("");
          else {
            if (valueWithoutSpaces.at(-1) === ".")
              setValue(parseFloat(valueWithoutSpaces));
            else
              setValue(
                !isNaN(valueWithoutSpaces)
                  ? parseFloat(valueWithoutSpaces)
                  : valueWithoutSpaces
              );
          }

          // const trimmedValue = e.target.value.replace(/\s/g, "");
          // setValue(Number(trimmedValue));
        }}
        className="custom_number_field"
      />
      {disabled && (
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

export default React.memo(HFFloatFieldCell);
