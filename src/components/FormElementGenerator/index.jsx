import { useMemo } from "react"
import FRow from "../FormElements-backup/FRow"
import HFCheckbox from "../FormElements/HFCheckbox"
import HFSelect from "../FormElements/HFSelect"
import HFTextField from "../FormElements/HFTextField"

const FormElementGenerator = ({ field = {}, control, ...props }) => {
  const computedOptions = useMemo(() => {
    if (!field.attributes?.options) return []

    return field.attributes.options.map((option) => ({
      value: option,
      label: option,
    }))
  }, [field.attributes?.options])


  switch (field.type) {
    case "SINGLE_LINE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )

    case "PICK_LIST":
      return (
        <FRow label={field.label} required={field.required}>
          <HFSelect
            control={control}
            name={field.slug}
            width="100%"
            options={computedOptions}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )

    case "MULTI_LINE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            fullWidth
            multiline
            rows={4}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )

    case "DATE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            fullWidth
            type="date"
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )

    case "NUMBER":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            fullWidth
            type="number"
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )

    case "CHECKBOX":
      return (
        <HFCheckbox
          control={control}
          name={field.slug}
          label={field.label}
          required={field.required}
          {...props}
        />
      )

    default:
      return (
        <FRow label={field.label} required={field.required} >
          <HFTextField
            control={control}
            name={field.slug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )
  }
}

export default FormElementGenerator
