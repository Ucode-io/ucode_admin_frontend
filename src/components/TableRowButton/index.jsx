import { Add } from "@mui/icons-material";
import { CTableCell, CTableRow } from "../CTable";
import styles from './style.module.scss'


const TableRowButton = ({ colSpan=2, onClick=()=>{} }) => {
  return ( <CTableRow>
    <CTableCell colSpan={colSpan}>
      <div
        className={styles.createButton}
        onClick={onClick}
      >
        <Add color="primary" />
        <p>Добавить</p>
      </div>
    </CTableCell>
  </CTableRow> );
}
 
export default TableRowButton;