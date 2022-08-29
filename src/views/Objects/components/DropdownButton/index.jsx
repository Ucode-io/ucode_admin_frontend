import { ArrowDropDown, ArrowDropUp, PictureAsPdf } from "@mui/icons-material"
import { CircularProgress, Menu } from "@mui/material"
import { useState } from "react"
import styles from "./style.module.scss"

const DropdownButton = ({
  exportToPDF,
  exportToHTML,
  pdfLoader,
  htmlLoader,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const pdfClick = () => {
    closeMenu()
    exportToPDF()
  }

  return (
    <>
      <div className={styles.buttonWrapper}>
        <div className={styles.button} onClick={exportToHTML}>
          Generate and edit
        </div>

        <div className={styles.iconBlock} onClick={openMenu}>
          {pdfLoader || htmlLoader ? (
            <CircularProgress size={14} color="secondary" />
          ) : !anchorEl ? (
            <ArrowDropUp />
          ) : (
            <ArrowDropDown />
          )}
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <div className={styles.scrollBlocksss}>
          <div
            className={`${styles.menuItem}`}
            onClick={pdfClick}
            // onClick={() => navigateToDocumentEditPage(template)}
          >
            <PictureAsPdf />
            <p className={styles.itemText}>Generate PDF</p>
          </div>
        </div>
      </Menu>
    </>
  )
}

export default DropdownButton
