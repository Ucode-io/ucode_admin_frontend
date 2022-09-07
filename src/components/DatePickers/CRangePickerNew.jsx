import { Today } from "@mui/icons-material"
import { InputAdornment, TextField } from "@mui/material"
import DatePicker from "react-multi-date-picker"
import CustomNavButton from "./Plugins/CustomNavButton"
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
import { locale } from "./Plugins/locale"

const CRangePickerNew = ({ value, onChange }) => {

  const changeHander = (val) => {
    if(!val?.length) onChange([])
    else {

      const computedValue = value?.map(el => new Date(el))
      debugger
      onChange(computedValue)
    }
  }

  return (
    <DatePicker
      render={(value, openCalendar, handleChange) => {
        return (
          <TextField
            value={value}
            onClick={openCalendar}
            onChange={handleChange}
            size="small"
            fullWidth
            autoComplete="off"
            placeholder="sasdasd"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Today />
                </InputAdornment>
              ),
            }}
          />
        )
      }}
      range
      renderButton={<CustomNavButton />}
      // animations={[opacity()]}
      plugins={[weekends()]}
      weekStartDayIndex={1}
      portal
      locale={locale}
      className="datePicker"
      format="DD.MM.YYYY"
      numberOfMonths={2}
      onChange={changeHander}
      // value={new Date(value) || ""}
      // onChange={(val) => onChange(val ? new Date(val) : "")}
    />
  )
}

export default CRangePickerNew
