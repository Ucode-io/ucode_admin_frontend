import { Card } from "@mui/material"
import style from "./style.module.scss"

const TableCard = ({ children, disablePagination = false, extra, header, width, cardStyles={} }) => {
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

        <div className={style.body} style={{ padding: disablePagination ? "16px" : "8px 8px 8px 8px", ...cardStyles }} >
          {children}
        </div>
      </Card>
    </div>
  )
}

export default TableCard
