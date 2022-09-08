import { useMemo } from "react"
import FRow from "../FormElements/FRow"
import HFAutocomplete from "../FormElements/HFAutocomplete"
import HFCheckbox from "../FormElements/HFCheckbox"
import HFDatePicker from "../FormElements/HFDatePicker"
import HFDateTimePicker from "../FormElements/HFDateTimePicker"
import HFFormulaField from "../FormElements/HFFormulaField"
import HFIconPicker from "../FormElements/HFIconPicker"
import HFImageUpload from "../FormElements/HFImageUpload"
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete"
import HFSwitch from "../FormElements/HFSwitch"
import HFTextEditor from "../FormElements/HFTextEditor"
import HFTextField from "../FormElements/HFTextField"
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask"
import HFTimePicker from "../FormElements/HFTimePicker"
import DynamicRelationFormElement from "./DynamicRelationFormElement"
import ManyToManyRelationFormElement from "./ManyToManyRelationFormElement"
import RelationFormElement from "./RelationFormElement"

const FormElementGenerator = ({
  field = {},
  control,
  setFormValue,
  fieldsList,
  ...props
}) => {
  // const computedOptions = useMemo(() => {
  //   if (!field.attributes?.options) return []

  //   return field.attributes.options.map((option) => ({
  //     value: option,
  //     label: option,
  //   }))
  // }, [field.attributes?.options])

  const computedSlug = useMemo(() => {
    if (field.id?.includes("@"))
      return `$${field.id.split("@")?.[0]}.${field.slug}`
    return field.slug
  }, [field.id, field.slug])

  if (field.id?.includes("#")) {
    if (field.relation_type === "Many2Many") {
      return (
        <ManyToManyRelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          {...props}
        />
      )
    } else if (field.relation_type === "Many2Dynamic") {
      return (
        <DynamicRelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          {...props}
        />
      )
    } else {
      return (
        <RelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          {...props}
        />
      )
    }
  }

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
          <HFAutocomplete
            control={control}
            name={computedSlug}
            width="100%"
            options={field?.attributes?.options}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )

    case "MULTI_LINE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextEditor
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

    case "DATE_TIME":
      return (
        <FRow label={field.label} required={field.required}>
          <HFDateTimePicker
            control={control}
            name={computedSlug}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
        </FRow>
      )

    case "TIME":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTimePicker
            control={control}
            name={computedSlug}
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
          <HFMultipleAutocomplete
            control={control}
            name={computedSlug}
            width="100%"
            required={field.required}
            field={field}
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

    case "ICON":
      return (
        <FRow label={field.label} required={field.required}>
          <HFIconPicker
            control={control}
            name={computedSlug}
            required={field.required}
            {...props}
          />
        </FRow>
      )

    case "FORMULA":
    case "INCREMENT_ID":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            InputProps={{
              readOnly: true,
              style: {
                background: "#c0c0c039",
              },
            }}
            {...props}
          />
        </FRow>
      )

    case "FORMULA_FRONTEND":
      return (
        <FRow label={field.label} required={field.required}>
          <HFFormulaField
            setFormValue={setFormValue}
            control={control}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            name={field.slug}
            fieldsList={fieldsList}
            field={field}
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
            InputProps={{
              readOnly: field.type === "INCREMENT_ID",
            }}
            {...props}
          />
        </FRow>
      )
  }
}

export default FormElementGenerator
