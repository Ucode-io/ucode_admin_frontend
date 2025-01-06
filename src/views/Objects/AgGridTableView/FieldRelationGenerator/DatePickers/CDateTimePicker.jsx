import DatePicker from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {DateRange, Lock} from "@mui/icons-material";
import {Box, InputAdornment, TextField, Tooltip} from "@mui/material";
import InputMask from "react-input-mask";
import {locale} from "./Plugins/locale";
import "react-multi-date-picker/styles/layouts/mobile.css";

const CDateTimePicker = ({
  value,
  placeholder = "",
  isBlackBg = false,
  classes = {},
  onChange = () => {},
  isTransparent = false,
  tabIndex = 0,
  mask = "",
  disabled = false,
  sectionModal = false,
}) => {
  return (
    <div className="main_wrapper">
      <DatePicker
        id={`date_time_${name}`}
        portal={sectionModal ? false : document.body}
        render={(value, openCalendar, handleChange) => {
          return (
            <InputMask
              mask={mask}
              value={value ?? undefined}
              onChange={handleChange}
              disabled={disabled}>
              {(InputProps) => (
                <TextField
                  value={value}
                  onClick={() => (disabled ? null : openCalendar())}
                  onChange={handleChange}
                  size="medium"
                  fullWidth
                  className={"custom_textfield_date"}
                  autoComplete="off"
                  autoFocus={tabIndex === 1}
                  InputProps={{
                    ...InputProps,
                    inputProps: {tabIndex},
                    readOnly: disabled,
                    classes: {
                      input: isBlackBg ? classes.input : "",
                    },
                  }}
                />
              )}
            </InputMask>
          );
        }}
        plugins={[weekends()]}
        weekStartDayIndex={1}
        locale={locale}
        portalTarget={sectionModal ? false : document.body}
        format="DD.MM.YYYY"
        value={new Date(value) || ""}
        onChange={(val) => onChange(val ? new Date(val) : "")}
      />
      <DatePicker
        id={`date_time_${name}`}
        disableDayPicker
        portal={sectionModal ? false : document.body}
        render={(value, openCalendar, handleChange) => {
          return (
            <InputMask
              mask={"99:99"}
              value={value ?? undefined}
              onChange={handleChange}
              disabled={disabled}>
              {(InputProps) => (
                <TextField
                  id={`date_time_${name}`}
                  value={value}
                  portalTarget={document.body}
                  portal={document.body}
                  onClick={() => (disabled ? null : openCalendar())}
                  onChange={handleChange}
                  autoComplete="off"
                  placeholder={placeholder.split("#")[1]}
                  className={"custom_textfield_time"}
                  style={{border: "none"}}
                  fullWidth
                  InputProps={{
                    readOnly: disabled,
                    classes: {
                      input: isBlackBg ? classes.input : "",
                    },
                    style: isTransparent
                      ? {
                          background: "transparent",
                        }
                      : disabled
                        ? {
                            background: "#c0c0c039",
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          }
                        : {
                            background: isBlackBg ? "#2A2D34" : "",
                            color: isBlackBg ? "#fff" : "",
                          },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{display: "flex", alignItems: "center"}}>
                          <DateRange
                            style={{
                              color: isBlackBg ? "#fff" : "",
                              fontSize: "20px",
                            }}
                          />
                          {disabled && (
                            <Tooltip title="This field is disabled for this role!">
                              <Lock style={{fontSize: "20px"}} />
                            </Tooltip>
                          )}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </InputMask>
          );
        }}
        plugins={[<TimePicker hideSeconds />]}
        format="HH:mm"
        value={new Date(value) || ""}
        onChange={(val) => onChange(val ? new Date(val) : "")}
      />
      {/* {showCopyBtn && (
        <CopyToClipboard copyText={value} style={{marginLeft: 8}} />
      )} */}
    </div>
  );
};

export default CDateTimePicker;
