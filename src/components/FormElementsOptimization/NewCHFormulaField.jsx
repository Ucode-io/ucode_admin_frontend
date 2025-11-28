import {numberWithSpaces} from "@/utils/formatNumbers";
import FunctionsIcon from "@mui/icons-material/Functions";
import {IconButton, InputAdornment, TextField, Tooltip} from "@mui/material";
import {Parser} from "hot-formula-parser";
import {useEffect, useState} from "react";

const parser = new Parser();

const NewCHFFormulaField = ({
  name,
  isTableView = false,
  fieldsList,
  disabled,
  isTransparent = false,
  newUi,
  row,
  rowData,
  ...props
}) => {
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);
  let formula = row?.attributes?.formula ?? "";

  const [innerValue, setInnerValue] = useState(row?.value);

  const updateValue = () => {
    const fieldsListSorted = fieldsList
      ? [...fieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length)
      : [];
    fieldsListSorted?.forEach((field) => {
      // value = row?.value ?? 0;

      const regex = new RegExp(`\\b${field.slug}\\b`, "g");

      if (formula?.includes(field.slug)) {
        formula = formula.replace(
          regex,
          rowData?.find((item) => item?.slug === field.slug)?.value,
        );
      }

      // if (typeof value === "string") value = `${value}`;
      // const regex = new RegExp(`\\b${field.slug}\\b`, "g");
      // formula = formula.replace(regex, value);
    });

    const { result } = parser.parse(formula);

    let newValue = result;

    if (`${newValue}` !== `${innerValue}`) setInnerValue(newValue);
  };

  useEffect(() => {
    updateValue();
  }, [rowData, row]);

  return (
    <TextField
      size="small"
      value={
        formulaIsVisible
          ? formula
          : typeof innerValue === "number"
            ? numberWithSpaces(innerValue)
            : innerValue
      }
      name={name}
      disabled={disabled}
      fullWidth
      sx={
        isTableView
          ? {
              "& .MuiOutlinedInput-notchedOutline": {
                border: "0",
              },
            }
          : ""
      }
      InputProps={{
        readOnly: disabled,
        style: {
          background: isTransparent ? "transparent" : "#fff",
          border: "0",
          borderWidth: "0px",
          height: newUi ? "25px" : undefined,
        },
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title={formulaIsVisible ? "Hide formula" : "Show formula"}>
              <IconButton
                edge="end"
                color={formulaIsVisible ? "primary" : "default"}
                onClick={() => setFormulaIsVisible((prev) => !prev)}
                style={newUi ? { padding: 2 } : {}}
              >
                <FunctionsIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default NewCHFFormulaField;
