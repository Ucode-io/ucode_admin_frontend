import { useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import FRow from "../../../../../../components/FormElements/FRow"
import HFMultipleAutocomplete from "../../../../../../components/FormElements/HFMultipleAutocomplete"
import HFTextField from "../../../../../../components/FormElements/HFTextField"

const DefaultValueBlock = ({ control }) => {
  const { t } = useTranslation()
  const field = useWatch({
    control,
  })

  return (
    <FRow label={t("default value")}>
      {field?.type === "MULTISELECT" ? (
        <HFMultipleAutocomplete
          control={control}
          name={"attributes.defaultValue"}
          width="100%"
          field={field}
          placeholder={t("default value")}
        />
      ) : (
        <HFTextField
          fullWidth
          name="attributes.defaultValue"
          control={control}
        />
      )}
    </FRow>
  )
}

export default DefaultValueBlock
