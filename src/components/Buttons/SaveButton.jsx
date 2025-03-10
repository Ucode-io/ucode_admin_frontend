

import { Button, CircularProgress } from "@mui/material"
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from "react-i18next";

const SaveButton = ({ children, loading, title = "save", ...props }) => {
  const { t } = useTranslation();
  return (
    <Button
      style={{ minWidth: 130 }}
      startIcon={
        loading ? (
          <CircularProgress size={14} style={{ color: "#fff" }} />
        ) : (
          <SaveIcon />
        )
      }
      variant="contained"
      {...props}
    >
      {t(title)}
    </Button>
  );
};

export default SaveButton
