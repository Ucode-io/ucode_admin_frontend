import { Menu, TextField } from "@mui/material"
import { useState } from "react"
import FRow from "../../FormElements/FRow"
import styles from "./style.module.scss"
import { useController } from "react-hook-form"
import Dropdown from "./Dropdown"
import { useMemo } from "react"
import { useEffect } from "react"
import constructorObjectService from "../../../services/constructorObjectService"
import { getLabelWithViewFields } from "../../../utils/getRelationFieldLabel"

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
  const [localValue, setLocalValue] = useState(null)

  const tablesList = useMemo(() => {
    return (
      field.attributes?.dynamic_tables?.map((el) => {
        return el.table ? { ...el.table, ...el } : el
      }) ?? []
    )
  }, [field.attributes?.dynamic_tables])

  const tableInValue = useMemo(() => {
    return tablesList?.find(table => value?.[`${table.slug}_id`]) ?? ''
  }, [ tablesList, value ])
  
  const onObjectSelect = (object, selectedTable) => {
    const data = {
      [`${selectedTable.slug}_id`]: object.value
    }
    setLocalValue(object)
    onChange(data)
    closeMenu()
  }

  const getValueData = async () => {
    try {
      const id = value?.[`${tableInValue.slug}_id`]
      const res = await constructorObjectService.getById(tableInValue.slug, id)
      const data = res?.data?.response
      setLocalValue(data ? { value: data.id, label: getLabelWithViewFields(tableInValue.view_fields, data) } : null)
    } catch (error) {
      
    }
  }

  console.log("VALUE ==>", value, tableInValue, localValue)

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if(tableInValue) {
      getValueData()
    }
  }, [])

  const computedInputString = useMemo(() => {
    if(!tableInValue || !localValue) return ''
    return `${tableInValue.label} / ${localValue.label}`
  }, [ tableInValue, localValue ])

  return (
    <>
      <FRow label={field.label} required={field.required}>
        <TextField
          size="small"
          fullWidth
          onClick={openMenu}
          value={computedInputString}
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
        <Dropdown field={field} closeMenu={closeMenu} onObjectSelect={onObjectSelect} tablesList={tablesList} />
      </Menu>
    </>
  )
}

export default DynamicRelationFormElement
