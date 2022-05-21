import { useMemo } from "react"
import FRow from "../FormElements/FRow"
import HFCheckbox from "../FormElements/HFCheckbox"
import HFDatePicker from "../FormElements/HFDatePicker"
import HFImageUpload from "../FormElements/HFImageUpload"
import HFMultipleSelect from "../FormElements/HFMultipleSelect"
import HFSelect from "../FormElements/HFSelect"
import HFSwitch from "../FormElements/HFSwitch"
import HFTextField from "../FormElements/HFTextField"
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask"
import RelationFormElement from "./RelationFormElement"

const FormElementGenerator = ({ field = {}, control, ...props }) => {

  const computedOptions = useMemo(() => {
    if (!field.attributes?.options) return []

    return field.attributes.options.map((option) => ({
      value: option,
      label: option,
    }))
  }, [field.attributes?.options])

  const computedSlug = useMemo(() => {
    if(field.id?.includes('@')) return `$${field.id.split("@")?.[0]}.${field.slug}`
    return field.slug
  }, [field.id, field.slug])

  if (field.id?.includes("#"))
    return (
      <RelationFormElement control={control} field={field} {...props} />
    )

  switch (field.type) {
    case "SINGLE_LINE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )

    case "PHONE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextFieldWithMask
            control={control}
            name={computedSlug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            mask={"(99) 999-99-99"}
            {...props}
          />
        </FRow>
      )

    case "PICK_LIST":
      return (
        <FRow label={field.label} required={field.required}>
          <HFSelect
            control={control}
            name={computedSlug}
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
            name={computedSlug}
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
          <HFDatePicker
            control={control}
            name={computedSlug}
            fullWidth
            width={"100%"}
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
            name={computedSlug}
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
          name={computedSlug}
          label={field.label}
          required={field.required}
          {...props}
        />
      )

    case "MULTISELECT":
      return (
        <FRow label={field.label} required={field.required}>
          <HFMultipleSelect
            control={control}
            name={computedSlug}
            width="100%"
            options={computedOptions}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )

    case "SWITCH":
      return (
        <HFSwitch
          control={control}
          name={computedSlug}
          label={field.label}
          required={field.required}
          {...props}
        />
      )

    case "EMAIL":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            rules={{
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Incorrect email format",
              },
            }}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )

    case "PHOTO":
      return (
        <FRow label={field.label} required={field.required}>
          <HFImageUpload
            control={control}
            name={computedSlug}
            required={field.required}
            {...props}
          />
        </FRow>
      )

    default:
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
  }
}

export default FormElementGenerator
