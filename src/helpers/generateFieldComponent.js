import Input from "../components/Input"
import Select from "../components/Select"
import Switch from "../components/Switch"
import TextArea from "../components/Textarea"
import Upload from "../components/Upload"

const GenerateFieldComponent = ({
  id,
  type,
  disabled,
  property_options,
  ...props
}) => {
  switch (type) {
    case "string":
      if(id === "611359b073bf6fe15aaef568") return <Input endAdornment="ga / sotih" {...props} />
      return <Input disabled={disabled} {...props} />

    case "number":
      return <Input type="number" disabled={disabled} {...props} />

    case "textarea":
      return <TextArea disabled={disabled} {...props} />

    case "boolean":
      return <Switch disabled={disabled} {...props} />

    case "date":
      return <Input type="date" disabled={disabled} {...props} />

    case "file":
      return <Upload disabled={disabled} {...props} />

    case "radio":
      return (
        <Select
          options={property_options?.map((option) => ({
            value: option.value,
            label: option.name,
          }))}
          disabled={disabled}
          {...props}
        />
      )

    case "checkbox":
      return (
        <Select
          isMulti
          options={property_options?.map((option) => ({
            value: option.value,
            label: option.name,
          }))}
          disabled={disabled}
          {...props}
        /> 
      )

    default:
      return <Input disabled={disabled} {...props} />
  }
}

export default GenerateFieldComponent