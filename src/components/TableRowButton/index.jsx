import { Add } from "@mui/icons-material"
import { CircularProgress } from "@mui/material"
import { useTranslation } from "react-i18next"
import { CTableCell, CTableRow } from "../CTable"
import styles from "./style.module.scss"

const TableRowButton = ({
  colSpan = 2,
  onClick = () => {},
  title = "add",
  loader,
}) => {
  const { t } = useTranslation()
  return (
    <CTableRow>
      <CTableCell colSpan={colSpan}>
        <div className={styles.createButton} onClick={onClick}>
          {loader ? (
            <CircularProgress size={16} className="mr-2" />
          ) : (
            <Add color="primary" />
          )}
          <p>{t(title)}</p>
        </div>
      </CTableCell>
    </CTableRow>
  )
}

export default TableRowButton
