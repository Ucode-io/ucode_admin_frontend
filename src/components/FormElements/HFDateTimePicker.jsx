import { Controller } from "react-hook-form"
import CDateTimePicker from "../DatePickers/CDateTimePicker"



const HFDateTimePicker = ({
  control,
  className,
  name,
  label,
  width,
  inputProps,
  disabledHelperText,
  placeholder,
  ...props
}) => {

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          // <div className={className}>
          //   <DateTimePicker
          //     inputFormat="dd.MM.yyyy HH:mm"
          //     mask="__.__.____ __:__"
          //     toolbarFormat="dd.MM.yyyy HH:mm"
          //     value={value}
          //     name={name}
          //     onChange={onChange}
          //     {...props}
          //     renderInput={(params) => (
          //       <TextField
          //         {...params}
          //         style={{ width }}
          //         size="small"
          //         error={error  }
          //         helperText={!disabledHelperText && error?.message}
          //         label={label}
          //         inputProps={{
          //           ...params.inputProps,
          //           placeholder
          //         }}
          //       />
          //     )}
          //   />
          // </div>
          <CDateTimePicker value={value} onChange={onChange} />
        )
      }}
    ></Controller>
  )
}

export default HFDateTimePicker
