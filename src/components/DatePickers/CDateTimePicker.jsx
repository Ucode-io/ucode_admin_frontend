import DatePicker from "react-multi-date-picker"
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
import { InputAdornment, TextField } from "@mui/material"
import { DateRange } from "@mui/icons-material"

import TimePickerPlugin from "./Plugins/TimePickerPlugin"
import "react-multi-date-picker/styles/layouts/mobile.css"
import { locale } from "./Plugins/locale"
import "./style2.scss"
import CustomNavButton from "./Plugins/CustomNavButton"
import TimePicker from "react-multi-date-picker/plugins/time_picker"

const CDateTimePicker = ({ value, onChange, disabled = false }) => {
  return (
    <>
      <DatePicker
        format="MM/DD/YYYY HH:mm:ss"
        plugins={[weekends(), <TimePickerPlugin />]}
        renderButton={<CustomNavButton />}
        weekStartDayIndex={1}
        locale={locale}
        onChange={(val) => onChange(val ? new Date(val) : "")}
        render={(value, openCalendar, handleChange) => (
          <TextField
            onClick={openCalendar}
            onChange={handleChange}
            fullWidth
            autoComplete="off"
            size="small"
            value={value}
            InputProps={{
              readOnly: disabled,
              style: disabled ? {
                background: "#c0c0c039",
              } : {},
              endAdornment: (
                <InputAdornment position="end">
                  <DateRange />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </>
    // <DatePicker
    //   render={(value, openCalendar, handleChange) => {
    //     return (
    //       <TextField
    //         value={value}
    //         onClick={openCalendar}
    //         onChange={handleChange}
    //         size="small"
    //         fullWidth
    //         autoComplete="off"
    //         InputProps={{
    //           readOnly: disabled,
    //           style: disabled
    //             ? {
    //                 background: "#c0c0c039",
    //               }
    //             : {},
    //           endAdornment: (
    //             <InputAdornment position="end">
    //               <DateRange />
    //             </InputAdornment>
    //           ),
    //         }}
    //       />
    //     )
    //   }}
    //   renderButton={<CustomNavButton />}
    //   // animations={[opacity()]}
    //   plugins={[weekends(), <TimePickerPlugin hideSeconds />]}
    //   weekStartDayIndex={1}
    //   // portal
    //   locale={locale}
    //   format="DD.MM.YYYY HH:mm"
    //   // currentDate={new Date()}
    //   value={new Date(value) || ""}
    //   className="rmdp-mobile"
    //   // mobileLabels={{
    //   //   OK: "sdfsdfsdfsdfsdfsdfsdfsd",
    //   // }}
    //   onChange={(val) => onChange(val ? new Date(val) : "")}
    // />
  )
}

export default CDateTimePicker
