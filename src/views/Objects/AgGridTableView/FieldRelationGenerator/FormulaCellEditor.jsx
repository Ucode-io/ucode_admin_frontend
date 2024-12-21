import {numberWithSpaces} from "@/utils/formatNumbers";
import {Lock} from "@mui/icons-material";
import FunctionsIcon from "@mui/icons-material/Functions";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import {Parser} from "hot-formula-parser";
import {useState} from "react";

const parser = new Parser();

const FormulaCellEditor = (props) => {
  const {field, setValue, value} = props;
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);
  const formula = field?.attributes?.formula ?? "";
  //   const values = useWatch({
  //     control,
  //   });

  const updateValue = () => {
    let computedFormula = formula;
    const fieldsListSorted = fieldsList
      ? [...fieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length)
      : [];
    fieldsListSorted?.forEach((field) => {
      // let value = values[field.slug] ?? 0;

      if (typeof value === "string") value = `'${value}'`;
      if (typeof value === "object") value = `"${value}"`;
      if (typeof value === "boolean")
        value = JSON.stringify(value).toUpperCase();
      computedFormula = computedFormula.replaceAll(`${field.slug}`, value);
    });

    const {error, result} = parser.parse(computedFormula);

    // let newValue = error ?? result;
    // const prevValue = values[name];
    // if (newValue !== prevValue) s(name, newValue);
  };

  // useDebouncedWatch(updateValue, [values], 300);

  //   useEffect(() => {
  //     updateValue();
  //   }, []);
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
      name={name}
      onChange={(e) => {
        const val = e.target.value;
        const valueWithoutSpaces = val.replaceAll(" ", "");

        if (!valueWithoutSpaces) onChange("");
        else
          onChange(
            !isNaN(Number(valueWithoutSpaces)) ? Number(valueWithoutSpaces) : ""
          );
        isNewTableView && updateObject();
      }}
      // error={error}
      // sx={
      //   isTableView
      //     ? {
      //         "& .MuiOutlinedInput-notchedOutline": {
      //           border: "0",
      //         },
      //       }
      //     : ""
      // }
      fullWidth
      // disabled={disabled}
      // autoFocus={tabIndex === 1}
      // helperText={!disabledHelperText && error?.message}
      InputProps={{
        // inputProps: {tabIndex},
        readOnly: field?.disabled,
        style: field?.disabled
          ? {
              background: "inherit",
              paddingRight: "0",
            }
          : {
              background: "inherit",
              color: "inherit",
            },
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
      {...props}
    />
  );
};

export default FormulaCellEditor;
