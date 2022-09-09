import { Drawer } from "@mui/material"
import { useState } from "react"
import CreateButton from "../../../../components/Buttons/CreateButton"
import Form from "./Form"
import styles from "./style.module.scss"

const MultipleInsertButton = ({ view, fieldsMap }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState()

  const openDrawer = () => {
    setDrawerIsOpen(true)
  }

  const closeDrawer = () => {
    setDrawerIsOpen(false)
  }

  return (
    <>
      <CreateButton
        type="secondary"
        title="Множественное добавление"
        onClick={openDrawer}
      />
      <Drawer
        open={drawerIsOpen}
        onClose={closeDrawer}
        anchor="right"
        classes={{ paperAnchorRight: styles.verticalDrawer }}
      >
        <Form view={view} fieldsMap={fieldsMap} onClose={closeDrawer} />
      </Drawer>
    </>
  )
}

export default MultipleInsertButton
