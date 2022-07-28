import DatePicker from "react-multi-date-picker"
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
import { InputAdornment, TextField } from "@mui/material"
import TimePickerPlugin from "./Plugins/TimePickerPlugin"
import "react-multi-date-picker/styles/layouts/mobile.css"
import { DateRange } from "@mui/icons-material"
import { locale } from "./Plugins/locale"
import "./style2.scss"
import CustomNavButton from "./Plugins/CustomNavButton"

const CTimePicker = ({ value, onChange }) => {
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
      renderButton={<CustomNavButton />}
      disableDayPicker
      // animations={[opacity()]}
      plugins={[weekends(), <TimePickerPlugin disablePreview />]}
      weekStartDayIndex={1}
      portal
      locale={locale}
      format="HH:mm"
      // currentDate={new DateObject()}
      value={new Date('12:20')}
      // mobileLabels={{
      //   OK: "sdfsdfsdfsdfsdfsdfsdfsd",
      // }}
      onChange={(date) => {
        onChange(date?.isValid ? date : "");
      }}
    />
  )
}

export default CTimePicker
