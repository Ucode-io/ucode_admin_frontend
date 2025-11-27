import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { numberWithSpaces } from "@/utils/formatNumbers";
import FunctionsIcon from "@mui/icons-material/Functions";

const HFFormulaField = ({
  name,
  isTableView = false,
  tabIndex,
  disabled,
  row,
  ...props
}) => {
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);

  const value = row?.value;

  const formula = row?.attributes?.formula ?? "";

  // const updateValue = () => {
  //   let computedFormula = formula;

  //   const fieldsListSorted = fieldsList
  //     ? [...fieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length)
  //     : [];

  //   fieldsListSorted?.forEach((field) => {
  //     let value = row?.value ?? 0;

  //     if (typeof value === "string") value = `'${value}'`;
  //     if (typeof value === "object") value = `"${value}"`;
  //     if (typeof value === "boolean")
  //       value = JSON.stringify(value).toUpperCase();
  //     computedFormula = computedFormula.replaceAll(`${field.slug}`, value);
  //   });

  //   const { error, result } = parser.parse(computedFormula);

  //   let newValue = error ?? result;
  //   const prevValue = row?.value;

  //   if (`${newValue}` !== `${prevValue}`) setInnerValue(newValue);
  // };

  // console.log(row?.value);

  // useEffect(() => {
  //   updateValue();
  // }, [row]);

  return (
    <>
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
        // onChange={(e) => {
        //   const val = e.target.value;
        //   const valueWithoutSpaces = val.replaceAll(" ", "");

        //   if (!valueWithoutSpaces) onChange("");
        //   else
        //     onChange(
        //       !isNaN(Number(valueWithoutSpaces))
        //         ? Number(valueWithoutSpaces)
        //         : ""
        //     );
        //   isNewTableView && updateObject();
        // }}
        // error={error}
        sx={
          isTableView
            ? {
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "0",
                },
              }
            : ""
        }
        fullWidth
        disabled={disabled}
        autoFocus={tabIndex === 1}
        // helperText={!disabledHelperText && error?.message}
        InputProps={{
          inputProps: { tabIndex },
          readOnly: disabled,
          style: {
            paddingRight: "26px",
            background: "inherit",
            color: "inherit",
          },
          endAdornment: (
            <InputAdornment position="end">
              <Box
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Tooltip
                  title={formulaIsVisible ? "Hide formula" : "Show formula"}
                >
                  <IconButton
                    edge="end"
                    color={formulaIsVisible ? "primary" : "default"}
                    onClick={() => setFormulaIsVisible((prev) => !prev)}
                  >
                    <FunctionsIcon />
                  </IconButton>
                </Tooltip>
                {/* {disabled && (
                  <Tooltip title="This field is disabled for this role!">
                    <InputAdornment position="start">
                      <Lock style={{ fontSize: "20px" }} />
                    </InputAdornment>
                  </Tooltip>
                )} */}
              </Box>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </>
  );
};

export default HFFormulaField;
