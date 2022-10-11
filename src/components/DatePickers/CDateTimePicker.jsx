import DatePicker from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { DateRange } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";

import "./style2.scss";
import { locale } from "./Plugins/locale";
import "react-multi-date-picker/styles/layouts/mobile.css";
import CopyToClipboard from "../CopyToClipboard";

const CDateTimePickerLegacy = ({
  value,
  isBlackBg,
  onChange,
  showCopyBtn = true,
  disabled = false,
}) => {
  console.log("value", value);
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
              placeholder="01.01.0001"
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
                  : {
                      background: isBlackBg ? "#2A2D34" : "",
                      color: isBlackBg ? "#fff" : "",
                    },
              }}
            />
          );
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
              placeholder="00:00"
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
                  : {
                      background: isBlackBg ? "#2A2D34" : "",
                      color: isBlackBg ? "#fff" : "",
                    },
                endAdornment: (
                  <InputAdornment position="end">
                    <DateRange />
                  </InputAdornment>
                ),
              }}
            />
          );
        }}
        plugins={[<TimePicker hideSeconds />]}
        portal
        format="HH:mm"
        value={new Date(value) || ""}
        onChange={(val) => onChange(val ? new Date(val) : "")}
      />
      {showCopyBtn && (
        <CopyToClipboard copyText={value} style={{ marginLeft: 8 }} />
      )}
    </div>
  );
};

export default CDateTimePickerLegacy;
