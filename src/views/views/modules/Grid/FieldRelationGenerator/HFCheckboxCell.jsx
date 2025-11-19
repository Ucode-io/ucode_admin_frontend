import {Box} from "@chakra-ui/react";
import {Checkbox} from "@mui/material";
import React, {useId} from "react";
import RowClickButton from "../RowClickButton";

const HFCheckboxCell = (props) => {
  const id = useId();
  const {setValue, value, colDef, data} = props;
  const disabled = colDef?.disabled;
  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };
  return (
    <>
      {" "}
      <Box pl={"10px"}>
        <Checkbox
          disabled={disabled}
          id={`checkbox${id}`}
          icon={
            <img src="/img/checbkox.svg" alt="checkbox" style={{width: 20}} />
          }
          checkedIcon={
            <img
              src="/img/checkbox-checked.svg"
              alt="checked"
              style={{width: 20}}
            />
          }
          style={{
            transform: "translatey(-1px)",
            marginRight: "8px",
            padding: "0px",
          }}
          checked={
            typeof value === "string" ? value === "true" : (value ?? false)
          }
          // autoFocus={tabIndex === 1}
          onChange={(_, val) => {
            setValue(val);
          }}
        />
      </Box>
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} right="5px" />
      )}
    </>
  );
};

export default React.memo(HFCheckboxCell);
