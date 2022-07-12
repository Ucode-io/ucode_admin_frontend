import { FormHelperText } from "@mui/material"
import { Controller } from "react-hook-form"
import IconPicker from "../IconPicker"

const HFIconPicker = ({
  control,
  name,
  disabledHelperText = false,
  required=false,
  rules={},
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{ required: required ? 'This is required field' : false, ...rules }}
      render={({ field : { onChange, value }, fieldState : { error  } })  => (
        <div>
          <IconPicker error={error} value={value} onChange={onChange} {...props} />
          {!disabledHelperText && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </div>
      )}
    >
    </Controller>
  )
}

export default HFIconPicker
