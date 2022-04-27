import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from "@mui/icons-material/Add"

const CreateButton = ({ children, title = "Добавить", ...props }) => {
  return (
    <LoadingButton
      startIcon={<AddIcon />}
      variant="contained"
      loadingPosition="start"
      {...props}
    >
      {title}
    </LoadingButton>
  )
}

export default CreateButton
