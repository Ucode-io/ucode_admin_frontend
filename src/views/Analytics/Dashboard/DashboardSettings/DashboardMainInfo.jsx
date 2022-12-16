import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useMutation, useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import SaveButton from "../../../../components/Buttons/SaveButton"
import Footer from "../../../../components/Footer"
import FRow from "../../../../components/FormElements/FRow"
import HFIconPicker from "../../../../components/FormElements/HFIconPicker"
import HFTextField from "../../../../components/FormElements/HFTextField"
import dashboardService from "../../../../services/analytics/dashboardService"
import styles from "./style.module.scss"

const DashboardMainInfo = () => {
  const { id } = useParams()
  const { control, reset, handleSubmit } = useForm()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { isLoading } = useQuery(
    ["GET_DASHBOARD_DATA", id],
    () => {
      return dashboardService.getById(id)
    },
    {
      onSuccess: (data) => {
        reset(data)
      },
    }
  )

  const { mutate, isLoading: btnLoading } = useMutation(
    (data) => {
      return dashboardService.update(data)
    },
    {
      onSuccess: () => {
        navigate(`/analytics/dashboard/${id}`)
      },
    }
  )

  return (
    <div className={styles.formCard}>
      <h2 className={styles.title}>{t("main")}</h2>

      <div className={styles.mainBlock}>
        <div className={styles.row}>
          <FRow label={t("main")}>
            <HFTextField control={control} name="name" fullWidth />
          </FRow>

          <FRow label={t("icon")}>
            <HFIconPicker control={control} name="icon" />
          </FRow>
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

export default DashboardMainInfo
