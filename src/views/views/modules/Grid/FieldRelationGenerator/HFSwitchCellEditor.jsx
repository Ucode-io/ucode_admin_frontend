import {Box, ChakraProvider, Switch} from "@chakra-ui/react";
import RowClickButton from "../RowClickButton";
import React from "react";

const HFSwitchCellEditor = (props) => {
  const {setValue, value, colDef, data} = props;
  const disabled = colDef?.disabled;
  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };
  return (
    <>
      <ChakraProvider>
        <Box pl={"10px"}>
          <Switch
            disabled={disabled}
            isChecked={value || false}
            onChange={(e) => {
              setValue(e.target.checked);
            }}
          />
        </Box>
      </ChakraProvider>
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} right="5px" />
      )}
    </>
  );
};

export default React.memo(HFSwitchCellEditor);
