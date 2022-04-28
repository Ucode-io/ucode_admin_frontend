import { useMemo } from "react"
import FRow from "../FormElements-backup/FRow"
import HFCheckbox from "../FormElements/HFCheckbox"
import HFSelect from "../FormElements/HFSelect"
import HFTextField from "../FormElements/HFTextField"

const FormElementGenerator = ({
  type,
  control,
  name,
  attributes,
  label,
  ...props
}) => {
  const computedOptions = useMemo(() => {
    if (!attributes?.options) return []

    return attributes.options.map((option) => ({
      value: option,
      label: option,
    }))
  }, [attributes?.options])


  switch (type) {
    case "SINGLE_LINE":
      return (
        <FRow label={label}>
          <HFTextField control={control} name={name} fullWidth {...props} />
        </FRow>
      )

    case "PICK_LIST":
      return (
        <FRow label={label}>
          <HFSelect
            control={control}
            name={name}
            width="100%"
            options={computedOptions}
          />
        </FRow>
      )

    case "MULTI_LINE":
      return (
        <FRow label={label}>
          <HFTextField
            control={control}
            name={name}
            fullWidth
            multiline
            rows={4}
            {...props}
          />
        </FRow>
      )

    case "DATE":
      return (
        <FRow label={label}>
          <HFTextField
            control={control}
            name={name}
            fullWidth
            type="date"
            {...props}
          />
        </FRow>
      )

    case "NUMBER":
      return (
        <FRow label={label}>
          <HFTextField
            control={control}
            name={name}
            fullWidth
            type="number"
            {...props}
          />
        </FRow>
      )

    case "CHECKBOX":
      return <HFCheckbox control={control} name label={label} {...props} />

    default:
      return (
        <FRow label={label}>
          <HFTextField control={control} name={name} fullWidth {...props} />
        </FRow>
      )
  }
}

export default FormElementGenerator
