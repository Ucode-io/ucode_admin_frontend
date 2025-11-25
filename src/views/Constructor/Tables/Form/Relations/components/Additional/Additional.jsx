import { Box } from "@mui/material"
import { FieldCheckbox } from "../../../components/FieldCheckbox/FieldCheckbox"
import { generateLangaugeText } from "@/utils/generateLanguageText"
import { useAdditionalProps } from "./useAdditionalProps"

export const Additional = ({control, watch, register, setValue, }) => {

  const {i18n, tableLan} = useAdditionalProps();

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <FieldCheckbox
        control={control}
        register={register}
        setValue={setValue}
        watch={watch}
        name="attributes.disabled"
        label={"Disabled"}
      />
      <FieldCheckbox
        control={control}
        register={register}
        setValue={setValue}
        watch={watch}
        name="required"
        label={
          generateLangaugeText(tableLan, i18n?.language, "Required") ||
          "Required"
        }
      />
      <FieldCheckbox
        control={control}
        register={register}
        setValue={setValue}
        watch={watch}
        name="default_editable"
        label={"Default editable"}
      />
      <FieldCheckbox
        control={control}
        register={register}
        setValue={setValue}
        watch={watch}
        name="creatable"
        label={"Creatable"}
      />
      <FieldCheckbox
        control={control}
        register={register}
        setValue={setValue}
        watch={watch}
        name="relation_buttons"
        label={"Relation Buttons"}
      />
    </Box>
  );
}
