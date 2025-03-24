import {Box, ChakraProvider, Switch} from "@chakra-ui/react";
import {useId} from "react";

const HFSwitchCellEditor = (props) => {
  const id = useId();
  const {field, setValue, value} = props;
  return (
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
  );
};

export default HFSwitchCellEditor;
