import { TextField } from "@mui/material"
import { Controller } from "react-hook-form"

const HFTextField = ({
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
        <TextField
        size="small"
        value={value}
        onChange={e => onChange(e.target.value)}
        name={name}
        error={error}
        helperText={!disabledHelperText && (error?.message ?? ' ')}
        {...props}
      />
      )}
    >
    </Controller>
  )
}

export default HFTextField
