import {Box, ChakraProvider} from "@chakra-ui/react";
import {Checkbox} from "@mui/material";
import {useId} from "react";
import RowClickButton from "../RowClickButton";

const HFCheckboxCell = (props) => {
  const id = useId();
  const {field, setValue, value, colDef} = props;
  return (
    <>
      {" "}
      <Box pl={"10px"}>
        <Checkbox
          disabled={field?.disabled}
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
      {props?.colDef?.colIndex === 0 && <RowClickButton right="5px" />}
    </>
  );
};

export default HFCheckboxCell;
