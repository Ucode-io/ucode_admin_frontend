import { Box } from "@mui/material"
import { Button } from "../Button"
import { useTranslation } from "react-i18next"

export const SaveCancelBtns = ({ cancelProps, saveProps, ...props }) => {

  const { t } = useTranslation()
  
  return <Box
    display="flex"
    justifyContent="flex-end"
    columnGap="10px"
    marginTop="24px"
    {...props}
  >
  <Button {...cancelProps} >{t("cancel")}</Button>
  <Button {...saveProps} primary>{t("save")}</Button>
</Box>
}
