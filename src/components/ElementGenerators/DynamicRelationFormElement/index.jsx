import { ArrowBack, Close } from "@mui/icons-material"
import { IconButton, Menu, TextField } from "@mui/material"
import { useState } from "react"
import FRow from "../../FormElements/FRow"
import IconGenerator from "../../IconPicker/IconGenerator"
import styles from "./style.module.scss"
import { useController } from "react-hook-form"
import { useMemo } from "react"
import { useQuery } from "react-query"
import constructorObjectService from "../../../services/constructorObjectService"
import {
  getLabelWithViewFields,
  getRelationFieldLabel,
} from "../../../utils/getRelationFieldLabel"
import Dropdown from "./Dropdown"

const DynamicRelationFormElement = ({ control, field, setFormValue }) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name: field.attributes?.relation_field_slug,
    control,
    defaultValue: null,
  })
  const [anchorEl, setAnchorEl] = useState(null)

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <FRow label={field.label} required={field.required}>
        <TextField
          size="small"
          fullWidth
          onClick={openMenu}
          InputProps={{
            readOnly: true,
          }}
        />
      </FRow>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <Dropdown field={field} closeMenu={closeMenu} />
      </Menu>
    </>
  )
}

export default DynamicRelationFormElement
