import { Card, Typography } from "@mui/material"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import CreateButton from "../../../../../components/Buttons/CreateButton"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import integrationService from "../../../../../services/auth/integrationService"

const SessionCreateForm = ({ addSession }) => {
  const { integrationId } = useParams()
  const { t } = useTransition()
  const [loader, setLoader] = useState(false)

  const onSubmit = ({ title }) => {
    setLoader(true)
    integrationService
      .createNewSession(integrationId, { title })
      .then((res) => console.log("RES ==>", res))
      .finally(() => setLoader(false))
  }

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
    },
  })

  return (
    <Card className="SessionCreateForm p-2">
      <Typography className="title" variant="h5">
        {t("create.new.sessions")}
      </Typography>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <HFTextField
          autoFocus
          disabledHelperText
          fullWidth
          control={control}
          name="title"
          label={t("title")}
        />

        <CreateButton type="submit" />
      </form>
    </Card>
  )
}

export default SessionCreateForm
