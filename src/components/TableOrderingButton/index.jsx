import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import styles from "./style.module.scss"

const TableOrderingButton = ({ value, onChange }) => {

  const clickHandler = () => {

    if(value === -1) onChange(1)
    else if(value === 1) onChange(undefined)
    else onChange(-1)
  }

  return (
    <div className={styles.button} onClick={clickHandler} >
      <ArrowDropUpIcon className={`${styles.icon} ${styles.up} ${value === 1 ? styles.active : ''}`} />
      <ArrowDropDownIcon className={`${styles.icon} ${styles.down} ${value === -1 ? styles.active : ''}`} />
    </div>
  )
}

export default TableOrderingButton
