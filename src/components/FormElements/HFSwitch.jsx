import { Switch } from "@mui/material"
import { useId } from "react"
import { Controller } from "react-hook-form"

const HFSwitch = ({ control, name, label, labelProps, ...props }) => {
  const id = useId()
  // const randomId = useMemo(() => {
  //   return generateRandomNumber()
  // }, [])

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <Switch
            id={`switch-${id}`}
            {...props}
            checked={value}
            onChange={(e, val) => onChange(val)}
          />
          <label htmlFor={`switch-${id}`} {...labelProps}>
            {label}
          </label>
        </div>
      )}
    ></Controller>
  )
}

export default HFSwitch
