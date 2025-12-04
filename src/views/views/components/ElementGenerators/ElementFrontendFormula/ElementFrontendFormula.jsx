import { useEffect, useState } from "react";
import {Parser} from "hot-formula-parser";


import { IconButton, Tooltip } from "@mui/material";
import FunctionsIcon from "@mui/icons-material/Functions";
import { numberWithSpaces } from "@/utils/formatNumbers";
import cls from "./styles.module.scss"

const parser = new Parser();

export const ElementFrontendFormula = ({ row, rowData, fieldsList }) => {
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);

  let formula = row?.attributes?.formula ?? "";

  const [innerValue, setInnerValue] = useState(row?.value);

  const updateValue = () => {
    const fieldsListSorted = fieldsList
      ? [...fieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length)
      : [];
    fieldsListSorted?.forEach((field) => {

      const regex = new RegExp(`\\b${field.slug}\\b`, "g");

      if (formula?.includes(field.slug)) {
        formula = formula.replace(
          regex,
          rowData?.find((item) => item?.slug === field.slug)?.value,
        );
      }
    });

    const { result } = parser.parse(formula);

    let newValue = result;

    if (`${newValue}` !== `${innerValue}`) setInnerValue(newValue);
  };

  useEffect(() => {
    updateValue();
  }, [rowData, row]);

  return (
    <div className={cls.frontendFormula}>
      <span className={cls.formula}>
        {formulaIsVisible
          ? formula
          : typeof innerValue === "number"
            ? numberWithSpaces(innerValue)
            : innerValue}
      </span>
      <Tooltip title={formulaIsVisible ? "Hide formula" : "Show formula"}>
        <IconButton
          edge="end"
          color={formulaIsVisible ? "primary" : "default"}
          onClick={() => setFormulaIsVisible((prev) => !prev)}
          style={{
            width: "32px",
            height: "32px",
          }}
        >
          <FunctionsIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
