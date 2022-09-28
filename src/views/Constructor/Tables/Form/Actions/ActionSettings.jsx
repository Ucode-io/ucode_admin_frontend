import { Close } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton"
import FRow from "../../../../../components/FormElements/FRow"
import HFAutocomplete from "../../../../../components/FormElements/HFAutocomplete"
import HFIconPicker from "../../../../../components/FormElements/HFIconPicker"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import constructorCustomEventService from "../../../../../services/constructorCustomEventService"
import listToOptions from "../../../../../utils/listToOptions"
import request from "../../../../../utils/request"
import styles from "./style.module.scss"

const ActionSettings = ({
  closeSettingsBlock = () => {},
  onUpdate = () => {},
  onCreate = () => {},
  action,
  formType,
  height,
}) => {
  const { slug } = useParams()

  const [loader, setLoader] = useState(false)

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      table_slug: slug,
    }
  })

  const { data: functions = [] } = useQuery(
    ["GET_FUNCTIONS_LIST"],
    () => {
      return request.get("/function")
    },
    {
      select: (res) => {
        return listToOptions(res.functions, "name", "id")
      },
    }
  )

  const createAction = (data) => {
    setLoader(true)

    constructorCustomEventService
      .create(data)
      .then((res) => {
        closeSettingsBlock()
        onCreate(res)
      })
      .catch(() => setLoader(false))
  }

  const updateAction = (data) => {
    setLoader(true)

    constructorCustomEventService
      .update(data)
      .then((res) => {
        closeSettingsBlock()
        onUpdate(data)
      })
      .catch(() => setLoader(false))
  }

  const submitHandler = (values) => {
    if (formType === "CREATE") createAction(values)
    else updateAction(values)
  }

  useEffect(() => {
    if (formType === "CREATE") return
    reset(action)
  }, [action, formType, reset])

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>{formType === "CREATE" ? "Create" : "Edit"} relation</h2>

        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody} style={{ height }}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className={styles.fieldSettingsForm}
        >
          <div className="p-2">
            <FRow label="Icon" required>
              <HFIconPicker control={control} required name="icon" />
            </FRow>

            <FRow label="Label" required>
              <HFTextField
                name="label"
                control={control}
                placeholder="Label"
                fullWidth
                required
              />
            </FRow>

            <FRow label="Function" required>
              <HFAutocomplete
                name="event_path"
                control={control}
                placeholder="Event path"
                options={functions}
                required
              />
            </FRow>
          </div>

          <div className={styles.settingsFooter}>
            <PrimaryButton
              size="large"
              className={styles.button}
              style={{ width: "100%" }}
              onClick={handleSubmit(submitHandler)}
              loader={loader}
            >
              Сохранить
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ActionSettings
