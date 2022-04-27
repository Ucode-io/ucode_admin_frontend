import { FormHelperText, TextField } from "@mui/material"
import { Controller } from "react-hook-form"
import IconPicker from "../IconPicker"

const HFIconPicker = ({
  control,
  name,
  disabledHelperText = false,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: 'THIS IS REQUIRED FIELD' }}
      render={({ field : { onChange, value }, fieldState : { error  } })  => (
        <div>
          <IconPicker error={error} value={value} onChange={onChange} />
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
