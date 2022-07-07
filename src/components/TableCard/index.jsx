import { Card } from "@mui/material"
import style from "./style.module.scss"

const TableCard = ({ children, disablePagination = false, extra, header, width }) => {
  return (
    <div className={style.wrapper}>
      <Card
        className={style.card}
        style={{ width }}
      >
        {extra && <div className={style.header}>
          <div>{header}</div>
          <div>
            {extra}
          </div>
        </div>}

        <div className={style.body} style={{ padding: disablePagination ? "16px" : "16px 16px 10px 16px" }} >
          {children}
        </div>
      </Card>
    </div>
  )
}

export default TableCard
