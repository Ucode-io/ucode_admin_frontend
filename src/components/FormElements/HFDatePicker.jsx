import { Controller } from "react-hook-form"
import CDatePicker from "../DatePickers/CDatePicker"

const HFDatePicker = ({ control, className, name, label, width, inputProps, disabledHelperText, placeholder, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={className}>
          <CDatePicker value={value} onChange={onChange} />
          {/* <DatePicker
            // inputFormat="dd.MM.yyyy"
            // mask="__.__.____"
            // toolbarFormat="dd.MM.yyyy"
            views={['year', 'month', 'day']}
            value={value}
            name={name}
            onChange={onChange}
            {...props}
            renderInput={(params) => (
              <TextField
                {...params}
                style={{ width }}
                size="small"
                error={error  }
                helperText={!disabledHelperText && error?.message}
                {...inputProps}
                inputProps={{
                  ...params.inputProps,
                  placeholder
                }}
                label={label}
              />
            )}
          /> */}
        </div>
      )}
    ></Controller>
  )
}

export default HFDatePicker
