import FormCard from "../../../../components/FormCard"
import FRow from "../../../../components/FormElements-backup/FRow"
import HFIconPicker from "../../../../components/FormElements/HFIconPicker"
import HFTextField from "../../../../components/FormElements/HFTextField"

const MainInfo = ({ control }) => {
  return (
    <FormCard title="Общие сведение">
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
      <FRow label="Иконка">
        <HFIconPicker
          control={control}
          name="icon"
          required
        />
      </FRow>
    </FormCard>
  )
}

export default MainInfo
