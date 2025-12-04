import { IconButton, Tooltip } from "@mui/material"
import FunctionsIcon from "@mui/icons-material/Functions";
import cls from "./styles.module.scss"
import { useState } from "react";

export const BackendFormulaDisplay = ({value, formula}) => {
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);

  return <div className={cls.formulaWrapper}>
    <span className={cls.formula}>
      {
        formulaIsVisible 
          ? formula 
          : value || <span>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20" height="20" x="0" y="0" viewBox="0 0 512 512" xmlSpace="preserve" className=""><g transform="matrix(1,0,0,1,0,0)"><path d="M263.507 62.967C265.179 51.833 272.833 40 283.729 40c11.028 0 20 8.972 20 20h40c0-33.084-26.916-60-60-60-33.629 0-55.527 28.691-59.784 57.073L211.083 144h-61.354v40h55.436l-39.22 265.073-.116.937c-1.063 10.62-9.393 21.99-20.1 21.99-11.028 0-20-8.972-20-20h-40c0 33.084 26.916 60 60 60 33.661 0 56.771-29.141 59.848-57.496L245.6 184h60.129v-40h-54.211l11.989-81.033zM426.271 248h-48.035l-25.987 39.085L334.923 248H291.17l34.827 78.569L270.523 410h48.035l26.652-40.085L362.979 410h43.753l-35.27-79.569z" fill="#637381" opacity="1" data-original="#000000" className=""></path></g></svg>
          </span>
      }
    </span>
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
  </div>
}