import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import {Parser} from "hot-formula-parser";
import {useState} from "react";
import {numberWithSpaces} from "@/utils/formatNumbers";
import {Lock} from "@mui/icons-material";
import FunctionsIcon from "@mui/icons-material/Functions";

const parser = new Parser();

const FrontendFormulaCellEditor = (props) => {
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);
  const {field, value, setValue} = props;
  const formula = field?.attributes?.formula ?? "";

  // useDebouncedWatch(updateValue, [values], 300);

  return (
    <TextField
      size="small"
      value={
        formulaIsVisible
          ? formula
          : typeof value === "number"
            ? numberWithSpaces(parseFloat(value).toFixed(2))
            : value
      }
      onChange={(e) => console.log("eeeeeeeeeeeeeee", e)}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Box style={{display: "flex", alignItems: "center", gap: "10px"}}>
              <Tooltip
                title={formulaIsVisible ? "Hide formula" : "Show formula"}>
                <IconButton
                  edge="end"
                  color={formulaIsVisible ? "primary" : "default"}
                  onClick={() => setFormulaIsVisible((prev) => !prev)}>
                  {/* <IconGenerator
                        icon="square-root-variable.svg"
                        size={15}
                      /> */}
                  <FunctionsIcon />
                </IconButton>
              </Tooltip>
              {field?.disabled && (
                <Tooltip title="This field is disabled for this role!">
                  <InputAdornment position="start">
                    <Lock style={{fontSize: "20px"}} />
                  </InputAdornment>
                </Tooltip>
              )}
            </Box>
          </InputAdornment>
        ),
      }}
      className="custom_field"
    />
  );
};

export default FrontendFormulaCellEditor;
