import { Settings } from "@mui/icons-material"
import { Menu, Modal } from "@mui/material"
import { useMemo, useState } from "react"
import { useQueryClient } from "react-query"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import ViewSettings from "."
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import styles from "./style.module.scss"

const SettingsButton = () => {
  const { tableSlug, appId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()


  const tables = useSelector((state) => state.constructorTable.list)

  const [anchorEl, setAnchorEl] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [isChanged, setIsChanged] = useState(false)

  const menuVisible = Boolean(anchorEl)

  const tableInfo = useMemo(() => {
    return tables?.find((table) => table.slug === tableSlug)
  }, [tables, tableSlug])

  const navigateToSettingsPage = () => {
    const url = `/settings/constructor/apps/${appId}/objects/${tableInfo?.id}/${tableInfo?.slug}`
    navigate(url)
  }

  const openModal = () => {
    closeMenu()
    setIsChanged(true)
    setModalVisible(true)
  }
  const closeModal = () => {
    console.log('isCHANGED -->', isChanged)
    setModalVisible(false)
    if(isChanged) queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"])
  }

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <RectangleIconButton color="white" onClick={openMenu} >
        <Settings />
      </RectangleIconButton>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.menuItem} onClick={navigateToSettingsPage} >
            Object settings
        </div>
        <div className={styles.menuItem} onClick={openModal} >
            View settings
        </div>
      </Menu>

      <Modal className={styles.modal} open={modalVisible} onClose={closeModal} >
        <ViewSettings closeModal={closeModal} setIsChanged={setIsChanged} />
      </Modal>


    </div>
  )
}

export default SettingsButton
