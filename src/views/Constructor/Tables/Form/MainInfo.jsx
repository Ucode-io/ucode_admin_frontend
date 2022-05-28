import { useMemo } from "react"
import { useFieldArray } from "react-hook-form"
import FormCard from "../../../../components/FormCard"
import FRow from "../../../../components/FormElements/FRow"
import HFIconPicker from "../../../../components/FormElements/HFIconPicker"
import HFSelect from "../../../../components/FormElements/HFSelect"
import HFSwitch from "../../../../components/FormElements/HFSwitch"
import HFTextField from "../../../../components/FormElements/HFTextField"
import listToOptions from "../../../../utils/listToOptions"

const MainInfo = ({ control }) => {

  const { fields } = useFieldArray({
    control,
    name: "fields",
    keyName: "key",
  })

  const computedFields = useMemo(() => {
    return listToOptions(fields, "label", "slug")
  }, [fields])

  return (
    <FormCard title="Общие сведение">
      <div className="flex" >
      <FRow label="Иконка">
        <HFIconPicker
          control={control}
          name="icon"
          required
        />
      </FRow>
      <FRow label="Показать в меню">
        <HFSwitch
          control={control}
          name="show_in_menu"
          required
        />
      </FRow>
      </div>
      
      <FRow label="Название">
        <HFTextField
          control={control}
          name="label"
          fullWidth
          placeholder="Название"
          required
        />
      </FRow>
      <FRow label="Описание">
        <HFTextField
          control={control}
          name="description"
          fullWidth
          placeholder="Описание"
          multiline
          required
          rows={4}
        />
      </FRow>
      <FRow label="SLUG">
        <HFTextField
          control={control}
          name="slug"
          fullWidth
          placeholder="SLUG"
          required
        />
      </FRow>
      <FRow label="Subtitle field">
        <HFSelect
          control={control}
          name="subtitle_field_slug"
          fullWidth
          placeholder="Subtitle field"
          options={computedFields}
          required
        />
      </FRow>
    </FormCard>
  )
}

export default MainInfo
