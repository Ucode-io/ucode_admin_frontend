import {Box, ChakraProvider, Switch} from "@chakra-ui/react";
import {useId} from "react";
import RowClickButton from "../RowClickButton";

const HFSwitchCellEditor = (props) => {
  const id = useId();
  const {field, setValue, value, colDef} = props;
  return (
    <>
      <ChakraProvider>
        <Box pl={"10px"}>
          <Switch
            isChecked={value || false}
            onChange={(e, val) => {
              setValue(e.target.checked);
            }}
          />
        </Box>
      </ChakraProvider>
      {props?.colDef?.colIndex === 0 && <RowClickButton right="5px" />}
    </>
  );
};

export default HFSwitchCellEditor;
