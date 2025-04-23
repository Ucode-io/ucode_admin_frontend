
import clsx from "clsx";
import style from "./style.module.scss"

const TableTag = ({ color, children, className }) => {
  return (
    <div className={clsx(style.tag, className, [style[color]])}>{children}</div>
  );
};
 
export default TableTag;