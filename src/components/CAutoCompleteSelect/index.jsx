import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"

const CAutoCompleteSelect = ({options, value, onChange}) => {
  console.log("VALUE ====>", value)

  const computedValue = useMemo(() => {
    return options?.map(option => option)
  }, [])

  return (
    <div>
      <Autocomplete
        // disablePortal
        options={options}
        value={value}
        onChange={(e, value) => onChange(value)}
        // onSelect={(e, val) => console.log("VAL ==>", e.target.value)}
        // isOptionEqualToValue={(option, value) => option.value === value.value}
        // sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} size="small" />}
      />
    </div>
  )
}

export default CAutoCompleteSelect
