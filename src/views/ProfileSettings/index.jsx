import { useForm } from "react-hook-form"
import FRow from "../../components/FormElements/FRow"
import Header from "../../components/Header"
import styles from "./styles.module.scss"
import HFSelect from "../../components/FormElements/HFSelect"
import HFRadioButton from "../../components/FormElements/HFRadioButton"
import { useDispatch, useSelector } from "react-redux"
import { authActions } from "../../store/auth/auth.slice"
import PrimaryButton from "../../components/Buttons/PrimaryButton"
import { alertActions } from "../../store/alert/alert.slice"

const ProfileSettings = () => {
  const profileSettings = useSelector((state) => state.auth.profileSettings)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      ...profileSettings,
      lang: {
        value: profileSettings.lang,
        label: profileSettings.lang,
      },
    },
  })
  const dispatch = useDispatch()

  const onSubmit = (data) => {
    dispatch(
      authActions.setProfileSettings({
        ...data,
      })
    )
    dispatch(alertActions.addAlert("Successfully updated!", "success"))
  }

  console.log("profileSettings", profileSettings)

  return (
    <div>
      <Header title="Главная / Настройки" backButtonLink={-1} />

      <div className="p-2">
        <div className={styles.card}>
          <p>Язык и настройки регионов</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FRow label="Язык">
              <HFSelect
                autoFocus
                fullWidth
                options={[
                  { value: "1234", label: "eng" },
                  { value: "123", label: "ru" },
                  { value: "124", label: "uz" },
                ]}
                control={control}
                name="lang"
              />
            </FRow>
            <FRow label="Часовой пояс">
              <HFSelect
                autoFocus
                fullWidth
                options={[
                  { value: "5", label: "+5" },
                  { value: "4", label: "+4" },
                  { value: "3", label: "+3" },
                ]}
                control={control}
                name="time_frame"
              />
            </FRow>
            <FRow label="Time format">
              <HFRadioButton
                name="time_format"
                control={control}
                options={[
                  { value: "12", label: "12" },
                  { value: "24", label: "24" },
                ]}
              />
            </FRow>
            <FRow label="Date format">
              <HFRadioButton
                name="date_format"
                control={control}
                options={[
                  { value: "mm/dd/yyyy", label: "mm/dd/yyyy" },
                  { value: "dd/mm/yyyy", label: "dd/mm/yyyy" },
                  { value: "yyyy/mm/dd", label: "yyyy/mm/dd" },
                ]}
              />
            </FRow>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <PrimaryButton type="submit">Save</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
