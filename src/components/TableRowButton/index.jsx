import { Add } from "@mui/icons-material";
import { CTableCell, CTableRow } from "../CTable";
import styles from './style.module.scss'


const TableRowButton = ({ colSpan=2, onClick=()=>{}, title="Добавить" }) => {
  return ( <CTableRow>
    <CTableCell colSpan={colSpan}>
      <div
        className={styles.createButton}
        onClick={onClick}
      >
        <Add color="primary" />
        <p>{title}</p>
      </div>
    </CTableCell>
  </CTableRow> );
}
 
export default TableRowButton;