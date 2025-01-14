import DatePicker from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {DateRange, Lock} from "@mui/icons-material";
import {Box, InputAdornment, TextField, Tooltip} from "@mui/material";
import InputMask from "react-input-mask";
import {locale} from "./Plugins/locale";
import "react-multi-date-picker/styles/layouts/mobile.css";
import {format, parse} from "date-fns";
import {useMemo} from "react";

const CDateTimePickerWithoutCell = ({
  value,
  isBlackBg = false,
  classes = {},
  onChange = () => {},
  tabIndex = 0,
  mask = "",
  showCopyBtn = true,
  disabled = false,
  sectionModal = false,
}) => {
  const onChangeHandler = (val) => {
    onChange(val ? format(new Date(val), "dd.MM.yyyy HH:mm") : "");
  };

  const computedValue = useMemo(() => {
    if (!value) return "";

    if (value.includes("Z")) return new Date(value);

    return parse(value, "dd.MM.yyyy HH:mm", new Date());
  }, [value]);

  return (
    <div>
      <DatePicker
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
        format="DD.MM.YYYY"
        value={computedValue || ""}
        onChange={onChangeHandler}
      />
      <DatePicker
        disableDayPicker
        render={(value, openCalendar, handleChange) => {
          return (
            <InputMask
              mask={"99:99"}
              value={value ?? undefined}
              onChange={handleChange}
              disabled={disabled}>
              {(InputProps) => (
                <TextField
                  value={value}
                  onClick={() => (disabled ? null : openCalendar())}
                  onChange={handleChange}
                  autoComplete="off"
                  className={"custom_textfield_time"}
                  style={{border: "none"}}
                  fullWidth
                  InputProps={{
                    readOnly: disabled,
                    classes: {
                      input: isBlackBg ? classes.input : "",
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
        portal
        format="HH:mm"
        value={computedValue || ""}
        onChange={onChangeHandler}
      />
      {/* {showCopyBtn && (
        <CopyToClipboard
          copyText={value}
          style={{marginLeft: 8, height: "38px"}}
        />
      )} */}
    </div>
  );
};

export default CDateTimePickerWithoutCell;
