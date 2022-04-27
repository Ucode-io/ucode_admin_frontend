import { useEffect, useMemo } from "react"
import { CTableCell, CTableRow } from "../../../../../components/CTable"
import { Add, Save, Settings } from "@mui/icons-material"
import styles from "./style.module.scss"
import { useForm } from "react-hook-form"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import { fieldTypes } from "../../../../../utils/constants/fieldTypes"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import { useParams } from "react-router-dom"


const FieldCreateForm = ({
  onSubmit,
  formIsVisible,
  setFormIsVisible,
  initialValues = {},
}) => {
  const { id } = useParams()


  const { handleSubmit, control, reset } = useForm()

  const computedFieldTypes = useMemo(() => {
    return fieldTypes.map((type) => ({
      value: type,
      label: type,
    }))
  }, [])

  useEffect(() => {
    
    reset({
      attributes: {},
        default: "",
        index: "string",
        label: "",
        required: true,
        slug: "",
        table_id: id,
        type: "",
        ...initialValues
    })

  }, [formIsVisible, id])

  const submitHandler = (values) => {
    onSubmit(values)
  }

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
        <HFTextField
          disabledHelperText
          fullWidth
          name="label"
          control={control}
          placeholder="Field Label"
          autoFocus
        />
      </CTableCell>
      <CTableCell>
        <HFTextField
          disabledHelperText
          fullWidth
          name="slug"
          control={control}
          placeholder="Field SLUG"
        />
      </CTableCell>
      <CTableCell>
        <HFSelect
          disabledHelperText
          name="type"
          control={control}
          options={computedFieldTypes}
          placeholder="Type"
        />
      </CTableCell>
      <CTableCell>
        <div className="flex">
          <RectangleIconButton color="success" className="mr-1">
            <Settings color="success" />
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

export default FieldCreateForm
