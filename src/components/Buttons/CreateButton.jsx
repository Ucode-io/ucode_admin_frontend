import LoadingButton from "@mui/lab/LoadingButton"
import AddIcon from "@mui/icons-material/Add"
import SecondaryButton from "./SecondaryButton"
import { useTranslation } from "react-i18next"

const CreateButton = ({ children, title = "add", type, ...props }) => {
  const { t } = useTranslation()

  if (type === "secondary")
    return (
      <SecondaryButton {...props}>
        <AddIcon />
        {t(title)}
      </SecondaryButton>
    )

  return (
    <LoadingButton
      startIcon={<AddIcon />}
      variant="contained"
      loadingPosition="start"
      {...props}
    >
      {t(title)}
    </LoadingButton>
  )
}

export default CreateButton
