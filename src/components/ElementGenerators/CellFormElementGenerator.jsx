import { useMemo } from "react"
import HFAutocomplete from "../FormElements/HFAutocomplete"
import HFCheckbox from "../FormElements/HFCheckbox"
import HFDatePicker from "../FormElements/HFDatePicker"
import HFDateTimePicker from "../FormElements/HFDateTimePicker"
import HFFormulaField from "../FormElements/HFFormulaField"
import HFIconPicker from "../FormElements/HFIconPicker"
import HFSwitch from "../FormElements/HFSwitch"
import HFTextField from "../FormElements/HFTextField"
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask"
import HFTimePicker from "../FormElements/HFTimePicker"
import CellElementGenerator from "./CellElementGenerator"
import CellRelationFormElement from "./CellRelationFormElement"


const CellFormElementGenerator = ({ field, fields, row, control, setFormValue, ...props }) => {

  const computedSlug = useMemo(() => {
    return field.slug
  }, [field.slug])

  if (field.type === "LOOKUP")
    return (
      <CellRelationFormElement control={control} field={field} setFormValue={setFormValue} {...props} />
    )

  switch (field.type) {
    case "SINGLE_LINE":
      return (
          <HFTextField
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

      case "FORMULA_FRONTEND":
        return (
            <HFFormulaField
              setFormValue={setFormValue}
              control={control}
              required={field.required}
              placeholder={field.attributes?.placeholder}
              name={computedSlug}
              fieldsList={fields}
              field={field}
            />
        )

    // case "MULTI_LINE":
    //   return (
    //     <FRow label={field.label} required={field.required}>
    //       <HFTextEditor
    //         control={control}
    //         name={computedSlug}
    //         fullWidth
    //         multiline
    //         rows={4}
    //         required={field.required}
    //         placeholder={field.attributes?.placeholder}
    //         {...props}
    //       />
    //     </FRow>
    //   )

    case "DATE":
      return (
          <HFDatePicker
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
              control={control}
              name={computedSlug}
              required={field.required}
              placeholder={field.attributes?.placeholder}
              {...props}
            />
        )

    case "NUMBER":
      return (
          <HFTextField
            control={control}
            name={computedSlug}
            fullWidth
            type="number"
            required={field.required}
            placeholder={field.attributes?.placeholder}
            {...props}
          />
      )

    case "CHECKBOX":
      return (
        <HFCheckbox
          control={control}
          name={computedSlug}
          required={field.required}
          {...props}
        />
      )

    // case "MULTISELECT":
    //   return (
    //     <FRow label={field.label} required={field.required}>
    //       <HFMultipleSelect
    //         control={control}
    //         name={computedSlug}
    //         width="100%"
    //         options={computedOptions}
    //         required={field.required}
    //         placeholder={field.attributes?.placeholder}
    //         {...props}
    //       />
    //     </FRow>
    //   )

    case "SWITCH":
      return (
        <HFSwitch
          control={control}
          name={computedSlug}
          required={field.required}
          {...props}
        />
      )

    case "EMAIL":
      return (
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
        <CellElementGenerator field={field} row={row} />
          // <HFTextField
          //   control={control}
          //   name={field.slug}
          //   fullWidth
          //   required={field.required}
          //   placeholder={field.attributes?.placeholder}
          //   InputProps={{
          //     readOnly: field.type === "INCREMENT_ID",
          //   }}
          //   {...props}
          // />
      )
  }
}

 
export default CellFormElementGenerator;