import clsx from "clsx";
import cls from "./styles.module.scss"
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

export const PromptInputToggler = ({ onClick, active }) => {

  return <button
    className={clsx(
      cls.inputToggler,
      {
        [cls.active]: active,
      }
    )}
    onClick={onClick}
  >
    <ArrowDropDownOutlinedIcon 
      style={{ transform: active ? "rotate(90deg)" : "rotate(-90deg)" }}
      fontSize="12px"
    />
  </button>
}
