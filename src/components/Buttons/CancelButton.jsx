import { Button, CircularProgress } from "@mui/material"
import CancelIcon from "@mui/icons-material/Cancel"
import { useTranslation } from "react-i18next";

const CancelButton = ({
  children,
  loading,
  title = "cancel",
  icon = <CancelIcon />,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Button
      style={{ minWidth: 130 }}
      startIcon={
        loading ? (
          <CircularProgress size={14} style={{ color: "#fff" }} />
        ) : (
          icon
        )
      }
      variant="contained"
      color="error"
      {...props}
    >
      {t(title)}
    </Button>
  );
};

export default CancelButton
