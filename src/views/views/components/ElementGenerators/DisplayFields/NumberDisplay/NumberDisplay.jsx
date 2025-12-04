import cls from "./styles.module.scss"
import { formatWithMask } from "@/utils/formatWithMask"

export const NumberDisplay = ({ value, onClick }) => {

  return <div className={cls.numberDisplay} onClick={onClick}>
    {formatWithMask(`${value}`, "#### #### #### ####")}
  </div>
}
