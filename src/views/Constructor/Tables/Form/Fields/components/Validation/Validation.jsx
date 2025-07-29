import cls from "./styles.module.scss"
import { Box } from "@mui/material"
import HFTextField from "@/components/FormElements/HFTextField"
import { FieldCheckbox } from "../FieldCheckbox"
import { generateLangaugeText } from "@/utils/generateLanguageText"
import { useTranslation } from "react-i18next"

export const Validation = ({ control, tableLan, watch, register, setValue }) => {

  const { i18n } = useTranslation()

  return <Box className={cls.validation}>
    <Box display="flex" flexDirection="column" rowGap="8px">
      <HFTextField
        className={cls.input}
        fullWidth
        name="attributes.validation"
        control={control}
        placeholder="RegEx"
      />
      <HFTextField
        className={cls.input}
        fullWidth
        name="attributes.validation_message"
        control={control}
        placeholder="Error message"
      />
    </Box>
    <Box display="flex" flexDirection="column" alignItems="flex-start" marginTop="8px">
      <FieldCheckbox 
        name={"attributes.disabled"} 
        label={generateLangaugeText(
          tableLan,
          i18n?.language,
          "Disabled"
        ) || "Disabled"}
        watch={watch}
        register={register}
        setValue={setValue}
      />
      <FieldCheckbox
        name={"required"}
        label={generateLangaugeText(
          tableLan,
          i18n?.language,
          "Required"
        ) || "Required"}
        watch={watch}
        register={register}
        setValue={setValue}
      />
      <FieldCheckbox
        name={"unique"}
        label={generateLangaugeText(
          tableLan,
          i18n?.language,
          "Duplicate"
        ) || "Duplicate"}
        watch={watch}
        register={register}
        setValue={setValue}
      />
    </Box>
  </Box>
}
