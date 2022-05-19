import { FilterAlt } from "@mui/icons-material";
import { Menu } from "@mui/material";
import { useState } from "react";
import styles from "./style.module.scss"

const TableColumnFilter = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const menuVisible = Boolean(anchorEl)


  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return ( <span style={{ float: 'right' }} >
      <FilterAlt onClick={openMenu} fontSize="10" className="pointer" />


      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        { children }
      </Menu>

  </span> );
}
 
export default TableColumnFilter;