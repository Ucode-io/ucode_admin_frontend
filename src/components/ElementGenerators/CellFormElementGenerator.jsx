import { useEffect, useMemo } from "react"
import { useWatch } from "react-hook-form"
import HFAutocomplete from "../FormElements/HFAutocomplete"
import HFCheckbox from "../FormElements/HFCheckbox"
import HFDatePicker from "../FormElements/HFDatePicker"
import HFDateTimePicker from "../FormElements/HFDateTimePicker"
import HFIconPicker from "../FormElements/HFIconPicker"
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete"
import HFNumberField from "../FormElements/HFNumberField"
import HFSwitch from "../FormElements/HFSwitch"
import HFTextField from "../FormElements/HFTextField"
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask"
import HFTimePicker from "../FormElements/HFTimePicker"
import CellElementGenerator from "./CellElementGenerator"
import CellRelationFormElement from "./CellRelationFormElement"

const CellFormElementGenerator = ({
  field,
  fields,
  isBlackBg = false,
  watch,
  columns = [],
  selected,
  row,
  control,
  setFormValue,
  shouldWork = false,
  index,
  ...props
}) => {
  const computedSlug = useMemo(() => {
    return `multi.${index}.${field.slug}`
  }, [field.slug, index])

  const changedValue = useWatch({
    control,
    name: computedSlug,
  })

  useEffect(() => {
    if (!row?.[field.slug]) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || "")
    }
  }, [field, row, setFormValue, computedSlug])

  useEffect(() => {
    if (columns.length && changedValue) {
      columns.forEach(
        (i, index) =>
          selected.includes(i.guid) &&
          setFormValue(`multi.${index}.${field.slug}`, changedValue)
      )
    }
  }, [changedValue, setFormValue, columns, field, selected])

  switch (field.type) {
    case "LOOKUP":
      return (
        <CellRelationFormElement
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          field={field}
          row={row}
          placeholder={field.attributes?.placeholder}
          setFormValue={setFormValue}
        />
      )

    case "SINGLE_LINE":
      return (
        <HFTextField
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
        />
      )

    case "PHONE":
      return (
        <HFTextFieldWithMask
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          mask={"(99) 999-99-99"}
          {...props}
        />
      )

    case "PICK_LIST":
      return (
        <HFAutocomplete
          control={control}
          name={computedSlug}
          width="100%"
          options={field?.attributes?.options}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
        />
      )

    case "MULTISELECT":
      return (
        <HFMultipleAutocomplete
          control={control}
          name={computedSlug}
          width="100%"
          required={field.required}
          field={field}
          placeholder={field.attributes?.placeholder}
          isBlackBg={isBlackBg}
          {...props}
        />
      )

    case "DATE":
      return (
        <HFDatePicker
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          width={"100%"}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
        />
      )

    case "DATE_TIME":
      return (
        <HFDateTimePicker
          isBlackBg={isBlackBg}
          showCopyBtn={false}
          control={control}
          name={computedSlug}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
        />
      )

    case "TIME":
      return (
        <HFTimePicker
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
        />
      )

    case "NUMBER":
      return (
        <HFNumberField
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          isBlackBg={isBlackBg}
          {...props}
        />
      )

    case "CHECKBOX":
      return (
        <HFCheckbox
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          {...props}
        />
      )

    case "SWITCH":
      return (
        <HFSwitch
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          {...props}
        />
      )

    case "EMAIL":
      return (
        <HFTextField
          isBlackBg={isBlackBg}
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
      )

    // case "PHOTO":
    //   return (
    //     <FRow label={field.label} required={field.required}>
    //       <HFImageUpload
    //         control={control}
    //         name={computedSlug}
    //         required={field.required}
    //         {...props}
    //       />
    //     </FRow>
    //   )

    case "ICON":
      return (
        <HFIconPicker
          control={control}
          name={computedSlug}
          required={field.required}
          {...props}
        />
      )

    default:
      return (
        <div style={{ padding: "0 4px" }}>
          <CellElementGenerator field={field} row={row} />
        </div>
      )
  }
}

export default CellFormElementGenerator
