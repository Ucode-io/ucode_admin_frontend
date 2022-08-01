import DatePicker from "react-multi-date-picker"
import TimePickerPlugin from "./Plugins/TimePickerPlugin"
import "react-multi-date-picker/styles/layouts/mobile.css"
import "./style2.scss"
import { InputAdornment, TextField } from "@mui/material"
import { DateRange } from "@mui/icons-material"

const CTimePicker = ({ value, onChange }) => {



  const getValue = () => {

    if(!value) return ""

    const result = new Date()

    result.setHours(value.split(':')?.[0])
    result.setMinutes(value.split(':')?.[1])

    return result
    // value ?  : new Date()
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <DateRange />
                </InputAdornment>
              ),
            }}
          />
        )
      }}
      // renderButton={<CustomNavButton />}
      disableDayPicker
      // animations={[opacity()]}
      plugins={[ <TimePickerPlugin disablePreview />]}
      // weekStartDayIndex={1}
      // portal
      // locale={locale}
      format="HH:mm"
      value={getValue()}
      // currentDate={new DateObject()}
      // value={value}
      // mobileLabels={{
      //   OK: "sdfsdfsdfsdfsdfsdfsdfsd",
      // }}
      onChange={(date) => {
        console.log("DATE ===>", date)
        onChange(date?.isValid ? date.format('HH:mm') : "");
      }}
    />
  )
}

export default CTimePicker
