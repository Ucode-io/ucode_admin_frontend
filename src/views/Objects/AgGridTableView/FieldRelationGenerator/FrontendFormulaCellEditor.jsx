import React, {useEffect, useState, useCallback} from "react";
import {TextField, InputAdornment, IconButton} from "@mui/material";
import {Parser} from "hot-formula-parser";
import FunctionsIcon from "@mui/icons-material/Functions";

const parser = new Parser();

const FrontendFormulaCellEditor = (props) => {
  const {data, value, node, field, formula} = props;
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);
  const [calculatedValue, setCalculatedValue] = useState(value);

  const evaluateFormula = useCallback(() => {
    if (!formula || !data) return;

    try {
      let computedFormula = formula;
      const fields = Object.keys(data);

      fields.forEach((key) => {
        const fieldValue = data[key] ?? 0;
        let replacementValue = fieldValue;

        if (typeof fieldValue === "string")
          replacementValue = `'${fieldValue}'`;
        if (typeof fieldValue === "object")
          replacementValue = `"${JSON.stringify(fieldValue)}"`;
        if (typeof fieldValue === "boolean")
          replacementValue = JSON.stringify(fieldValue).toUpperCase();

        computedFormula = computedFormula.replaceAll(key, replacementValue);
      });

      const {error, result} = parser.parse(computedFormula);

      if (error) {
        console.error("Formula evaluation error:", error);
        setCalculatedValue("ERROR");
        node.setDataValue(field.slug, "ERROR");
      } else {
        setCalculatedValue(result);
        node.setDataValue(field.slug, result);
      }
    } catch (err) {
      console.error("Error evaluating formula:", err);
    }
  }, [data, node, field]);

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };

  useEffect(() => {
    evaluateFormula();
  }, [Object?.values(data ?? {})?.map((el) => el), evaluateFormula]);

  return (
    <>
      <TextField
        size="small"
        value={formulaIsVisible ? formula : calculatedValue}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setFormulaIsVisible(!formulaIsVisible)}>
                <FunctionsIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
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
        className="custom_textfield_new"
      />
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} right="5px" />
      )}
    </>
  );
};

export default FrontendFormulaCellEditor;
