import { useEffect, useMemo, useState } from "react"
import { CTableCell, CTableRow } from "../../../../../components/CTable"
import { Add, Close, Save, Settings } from "@mui/icons-material"
import styles from "../Fields/style.module.scss"
import { useForm } from "react-hook-form"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import { fieldTypes } from "../../../../../utils/constants/fieldTypes"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { relationTyes } from "../../../../../utils/constants/relationTypes"

const RelationCreateForm = ({
  onSubmit,
  formIsVisible,
  setFormIsVisible,
  initialValues = {},
}) => {
  const { slug } = useParams()
  const tablesList = useSelector(state => state.constructorTable.list)


  const computedTablesList = useMemo(() => {
    return tablesList.map(table => ({
      value: table.slug,
      label: table.label,
    }))
  }, [tablesList])

  const computedRelationsTypesList = useMemo(() => {
    return relationTyes.map(type => ({
      value: type,
      label: type,
    }))
  }, [])

  const { handleSubmit, control, reset } = useForm()

  const submitHandler = (values) => {
    onSubmit(values)
  }

  useEffect(() => {
    reset({
      table_from: slug,
      table_to: "",
      type: "",
      ...initialValues,
    })
  }, [formIsVisible])

  if (!formIsVisible)
    return (
      <CTableRow>
        <CTableCell colSpan={4}>
          <div
            className={styles.createButton}
            onClick={() => setFormIsVisible(true)}
          >
            <Add color="primary" />
            <p>Добавить</p>
          </div>
        </CTableCell>
      </CTableRow>
    )

  return (
    <CTableRow>
      <CTableCell>
        <HFSelect
          disabledHelperText
          name="table_from"
          control={control}
          placeholder="Field Label"
          options={computedTablesList}
          disabled
          autoFocus
          required
        />
      </CTableCell>
      <CTableCell>
        <HFSelect
          disabledHelperText
          name="table_to"
          control={control}
          placeholder="Field SLUG"
          options={computedTablesList}
          required
        />
      </CTableCell>
      <CTableCell>
        <HFSelect
          disabledHelperText
          name="type"
          control={control}
          placeholder="Type"
          options={computedRelationsTypesList}
          required
        />
      </CTableCell>
      <CTableCell>
        <div className="flex">
          <RectangleIconButton
            color="error"
            className="mr-1"
          >
            <Close color="error" />
          </RectangleIconButton>
          <RectangleIconButton
            color="primary"
            onClick={handleSubmit(submitHandler)}
          >
            <Save color="primary" />
          </RectangleIconButton>
        </div>
      </CTableCell>
    </CTableRow>
  )
}

export default RelationCreateForm
