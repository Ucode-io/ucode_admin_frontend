import { Card } from "@mui/material"
import style from "./style.module.scss"
import clsx from "clsx";

const TableCard = ({
  children,
  type,
  disablePagination = false,
  extra,
  header,
  width,
  cardStyles = {},
  className,
  bodyClassname,
}) => {
  return (
    <div className={clsx(style.wrapper, style[type] ?? "", className)}>
      <Card className={style.card} style={{ width }}>
        {(extra || header) && (
          <div className={style.header}>
            <div>{header}</div>
            <div>{extra}</div>
          </div>
        )}

        <div
          className={clsx(style.body, bodyClassname)}
          style={{
            padding: disablePagination ? "16px" : "8px 8px 8px 8px",
            ...cardStyles,
          }}
        >
          {children}
        </div>
      </Card>
    </div>
  );
};

export default TableCard
