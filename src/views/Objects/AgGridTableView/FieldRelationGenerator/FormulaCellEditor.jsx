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
import React, {useState} from "react";
import RowClickButton from "../RowClickButton";

const parser = new Parser();

const FormulaCellEditor = (props) => {
  let {value, data} = props;
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);
  const formula = colDef?.formula ?? "";
  const disabled = colDef?.disabled;

  // const updateValue = () => {
  //   let computedFormula = formula;
  //   const fieldsListSorted = fieldsList
  //     ? [...fieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length)
  //     : [];
  //   fieldsListSorted?.forEach((field) => {
  //     // let value = values[field.slug] ?? 0;

  //     if (typeof value === "string") value = `'${value}'`;
  //     if (typeof value === "object") value = `"${value}"`;
  //     if (typeof value === "boolean")
  //       value = JSON.stringify(value).toUpperCase();
  //     computedFormula = computedFormula.replaceAll(`${field.slug}`, value);
  //   });

  //   const {error, result} = parser.parse(computedFormula);
  // };

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };

  return (
    <>
      {" "}
      <TextField
        size="small"
        className="custom_textfield_new"
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
              !isNaN(Number(valueWithoutSpaces))
                ? Number(valueWithoutSpaces)
                : ""
            );
          isNewTableView && updateObject();
        }}
        fullWidth
        disabled={disabled}
        sx={{
          backgroundColor: "transparent",
          "& .MuiInputBase-root": {
            backgroundColor: "transparent",
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "transparent",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
        }}
        InputProps={{
          // inputProps: {tabIndex},
          readOnly: disabled,
          style: disabled
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
                {disabled && (
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
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} right="5px" />
      )}
    </>
  );
};

export default React.memo(FormulaCellEditor);
