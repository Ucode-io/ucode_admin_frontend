import { FilterAlt } from "@mui/icons-material"
import { Menu, Switch } from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import FiltersBlockButton from "../../../../components/Buttons/FiltersBlockButton"
import { tableColumnActions } from "../../../../store/tableColumn/tableColumn.slice"
import styles from "./style.module.scss"

const FiltersDropdown = ({ columns }) => {
  const { tableSlug } = useParams()

  const [anchorEl, setAnchorEl] = useState(null)
  const menuVisible = Boolean(anchorEl)

  const dispatch = useDispatch()

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const onChecked = (value, index) => {
    dispatch(
      tableColumnActions.setColumnFilterVisible({
        tableSlug,
        index,
        isFilterVisible: value,
      })
    )
  }

  return (
    <div>
      <FiltersBlockButton onClick={openMenu}>
        <FilterAlt color="primary" />
        Быстрый фильтр
      </FiltersBlockButton>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          {columns.map((column, index) => (
            <div key={column.id} className={styles.menuItem}>
              <p className={styles.itemText}>{column.label}</p>
              <Switch
                checked={column.isFilterVisible}
                onChange={(_, value) => onChecked(value, index)}
              />
            </div>
          ))}
        </div>
      </Menu>
    </div>
  )
}

export default FiltersDropdown
