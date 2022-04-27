import { Button } from "@mui/material"
import CancelIcon from "@mui/icons-material/Cancel"

const CancelButton = ({ children, title = "Cancel", ...props }) => {
  return (
    <Button
      style={{ minWidth: 130 }}
      startIcon={<CancelIcon />}
      variant="contained"
      color="error"
      {...props}
    >
      {title}
    </Button>
  )
}

export default CancelButton
