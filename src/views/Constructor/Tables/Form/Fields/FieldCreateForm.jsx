import { useEffect, useMemo, useState } from "react"
import { CTableCell, CTableRow } from "../../../../../components/CTable"
import { Add, Save, Settings } from "@mui/icons-material"
import styles from "./style.module.scss"
import { useForm } from "react-hook-form"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import { fieldTypes } from "../../../../../utils/constants/fieldTypes"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import { useParams } from "react-router-dom"
import Attributes from "./Attributes"

const FieldCreateForm = ({
  onSubmit,
  formIsVisible,
  setFormIsVisible,
  initialValues = {},
}) => {
  const { id } = useParams()

  const [attributesModalVisible, setAttributesModalVisible] = useState(false)

  const { handleSubmit, control, reset, getValues, watch } = useForm()

  const computedFieldTypes = useMemo(() => {
    return fieldTypes.map((type) => ({
      value: type,
      label: type,
    }))
  }, [])

  const openAttributesModal = () => {
    if(!getValues('type')) return
    setAttributesModalVisible(true)
  }

  const closeAttributesModal = () => {
    setAttributesModalVisible(false)
  }

  const submitHandler = (values) => {
    onSubmit(values)
  }

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
    <>
      {attributesModalVisible && (
        <Attributes
          control={control}
          getValues={getValues}
          reset={reset}
          closeModal={closeAttributesModal}
        />
      )}
      <CTableRow>
        <CTableCell>
          <HFTextField
            disabledHelperText
            fullWidth
            name="label"
            control={control}
            placeholder="Field Label"
            autoFocus
            required
          />
        </CTableCell>
        <CTableCell>
          <HFTextField
            disabledHelperText
            fullWidth
            name="slug"
            control={control}
            placeholder="Field SLUG"
            required
          />
        </CTableCell>
        <CTableCell>
          <HFSelect
            disabledHelperText
            name="type"
            control={control}
            options={computedFieldTypes}
            placeholder="Type"
            required
          />
        </CTableCell>
        <CTableCell>
          <div className="flex">
            <RectangleIconButton
              color="success"
              className="mr-1"
              onClick={openAttributesModal}
            >
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
    </>
  )
}

export default FieldCreateForm
