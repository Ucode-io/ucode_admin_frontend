import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { CloseButton } from "../CloseButton";

export const ParamsHeader = ({ formType, onClose = () => {} }) => {

  return <Box className={cls.header}>
  <p className={cls.title}>
    {formType === "CREATE" ? "Create field" : "Edit fields"}
  </p>
  <CloseButton onClick={onClose} />
</Box>
}
