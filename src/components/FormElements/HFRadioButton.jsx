import { FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { Controller } from "react-hook-form"

const HFRadioButton = ({ name, control, options }) => {
  return (
    <Controller
      rules={{ required: true }}
      control={control}
      name={name}
      render={({ field }) => (
        <RadioGroup {...field} style={{ flexDirection: "row" }}>
          {options.map((i) => (
            <FormControlLabel
              key={i.value}
              value={i.value}
              control={<Radio />}
              label={i.label}
            />
          ))}
        </RadioGroup>
      )}
    />
  )
}

export default HFRadioButton
