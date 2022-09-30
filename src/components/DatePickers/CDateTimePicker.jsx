import DatePicker from "react-multi-date-picker"
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import { DateRange } from "@mui/icons-material"
import { InputAdornment, TextField } from "@mui/material"

import "./style2.scss"
import { locale } from "./Plugins/locale"
import "react-multi-date-picker/styles/layouts/mobile.css"

const CDateTimePickerLegacy = ({ value, onChange, disabled = false }) => {
  return (
    <div className="main_wrapper">
      <DatePicker
        render={(value, openCalendar, handleChange) => {
          return (
            <TextField
              value={value}
              onClick={openCalendar}
              onChange={handleChange}
              size="small"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRight: 0,
                },
              }}
              fullWidth
              autoComplete="off"
              InputProps={{
                readOnly: disabled,
                style: disabled
                  ? {
                      background: "#c0c0c039",
                    }
                  : {},
              }}
            />
          )
        }}
        plugins={[weekends()]}
        weekStartDayIndex={1}
        portal
        locale={locale}
        format="DD.MM.YYYY"
        value={new Date(value) || ""}
        onChange={(val) => onChange(val ? new Date(val) : "")}
      />
      <DatePicker
        disableDayPicker
        render={(value, openCalendar, handleChange) => {
          return (
            <TextField
              value={value}
              onClick={openCalendar}
              onChange={handleChange}
              size="small"
              autoComplete="off"
              style={{ border: "none" }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderLeft: 0,
                },
              }}
              InputProps={{
                readOnly: disabled,
                style: disabled
                  ? {
                      background: "#c0c0c039",
                    }
                  : {},
                endAdornment: (
                  <InputAdornment position="end">
                    <DateRange />
                  </InputAdornment>
                ),
              }}
            />
          )
        }}
        plugins={[<TimePicker hideSeconds />]}
        portal
        format="HH:mm"
        value={new Date(value) || ""}
        onChange={(val) => onChange(val ? new Date(val) : "")}
      />
    </div>
  )
}

export default CDateTimePickerLegacy
