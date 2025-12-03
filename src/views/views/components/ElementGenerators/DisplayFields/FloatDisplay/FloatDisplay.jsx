import formatWithSpaces from "@/utils/formatWithSpace";
import cls from "./styles.module.scss";

export const FloatDisplay = ({ value, onClick = () => {} }) => {
  return <div className={cls.floatDisplay} onClick={onClick}>{formatWithSpaces(value)}</div>
}