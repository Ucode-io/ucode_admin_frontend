import { FileOpen } from "@mui/icons-material"
import { Menu, Tooltip } from "@mui/material"
import { useState } from "react"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import CSelect from "../../../../components/CSelect"
import Form from "./Form"
import styles from "./style.module.scss"

const DocumentGeneratorButton = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title="Generate document" >
        <RectangleIconButton color="white" onClick={openMenu} >
          <FileOpen />
        </RectangleIconButton>
      </Tooltip>


      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={anchorEl}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <Form closeMenu={closeMenu} />
      </Menu>


    </>
  )
}

export default DocumentGeneratorButton
