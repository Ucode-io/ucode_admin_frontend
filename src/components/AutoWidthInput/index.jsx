import AutosizeInput from "react-input-autosize"

const AutoWidthInput = ({ value = "", onChange, ...props }) => {

  return (
    <AutosizeInput
      value={value}
      onChange={onChange}
      inputStyle={{ border: 'none', outline: 'none', fontWeight: 500, minWidth: 20 }}
      {...props}
    />
  )
}

export default AutoWidthInput
