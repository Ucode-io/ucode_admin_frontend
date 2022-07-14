import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import SaveButton from "../../../../components/Buttons/SaveButton"
import Footer from "../../../../components/Footer"
import FRow from "../../../../components/FormElements/FRow"
import HFSelect from "../../../../components/FormElements/HFSelect"
import HFTextField from "../../../../components/FormElements/HFTextField"
import variableService from "../../../../services/analytics/variableService"
import styles from "./style.module.scss"

const variableTypes = [
  {
    label: "Query",
    value: "Query",
  },
  {
    label: "Custom",
    value: "Custom",
  }
]


const VariableCreateForm = () => {
  const { id, variableId } = useParams()
  const { control, reset, handleSubmit } = useForm()
  const navigate = useNavigate()

  const { isLoading } = useQuery(
    ["GET_VARIABLE_DATA", variableId],
    () => {
      if (!variableId)
        return {
          label: "",
          slug: "",
          type: "",
        }
      return variableService.getById(variableId)
    },
    {
      onSuccess: (data) => {
        reset(data)
      },
    }
  )

  const { mutate, isLoading: btnLoading } = useMutation(
    (data) => {
      if (!variableId) return variableService.create(data)
      return variableService.update(data)
    },
    {
      onSuccess: () => {
        navigate(`/analytics/dashboard/${id}/settings/variables`)
      },
    }
  )

  return (
    <div className={styles.formCard}>
      <h2 className={styles.title}>Общие сведение</h2>

      <div className={styles.mainBlock}>
        <div className={styles.row}>
          <FRow label="Названия">
            <HFTextField control={control} name="label" fullWidth required />
          </FRow>

          <FRow label="Slug">
            <HFTextField control={control} name="slug" fullWidth required />
          </FRow>
        </div>

        <div className={styles.row}>
          <FRow label="Названия">
            <HFSelect options={variableTypes} control={control} name="type" required />
          </FRow>

          <div style={{ width: '100%' }} ></div>

        </div>
      </div>

      <Footer
      extra={
        <SaveButton loading={btnLoading} onClick={handleSubmit(mutate)} />
      }
      />
    </div>
  )
}

export default VariableCreateForm
