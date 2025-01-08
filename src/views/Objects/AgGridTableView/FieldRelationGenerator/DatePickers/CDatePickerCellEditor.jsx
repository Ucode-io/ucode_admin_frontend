import DatePicker from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import {Box, InputAdornment, TextField, Tooltip} from "@mui/material";
import {Lock, Today} from "@mui/icons-material";
import InputMask from "react-input-mask";
import {useRef} from "react";

import {locale} from "./Plugins/locale";
import CustomNavButton from "./Plugins/CustomNavButton";
import "react-multi-date-picker/styles/layouts/mobile.css";
// import "./style2.scss";

const CDatePickerCellEditor = ({
  sectionModal = false,
  disabled = false,
  value,
  onChange = () => {},
  placeholder = "",
  isBlackBg = false,
  mask,
  required = false,
}) => {
  const datePickerRef = useRef();
  return (
    <Box sx={{width: "100%", height: "100%"}}>
      <DatePicker
        disabled={disabled}
        required={required}
        ref={datePickerRef}
        portal={sectionModal ? false : document.body}
        render={(value, openCalendar, handleChange) => {
          document?.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              datePickerRef?.current?.closeCalendar();
            }
          });
          return (
            <InputMask
              mask={mask}
              value={value ?? undefined}
              onChange={handleChange}
              disabled={disabled}
              required={required}>
              {(InputProps) => (
                <TextField
                  size="small"
                  id={`date_${name}`}
                  placeholder={placeholder}
                  inputFormat="dd.MM.yyyy"
                  onClick={openCalendar}
                  fullWidth
                  autoComplete="off"
                  InputProps={{
                    ...InputProps,
                    readOnly: disabled,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{display: "flex", alignItems: "center"}}>
                          <Today
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
                  className={"custom_textfield_new"}
                />
              )}
            </InputMask>
          );
        }}
        renderButton={<CustomNavButton />}
        plugins={[weekends()]}
        weekStartDayIndex={1}
        locale={locale}
        className="datePicker"
        format="DD.MM.YYYY"
        inputFormat="dd.MM.yyyy"
        value={new Date(value) || ""}
        onChange={(val) => onChange(new Date(val) || "")}
      />
    </Box>
  );
};

export default CDatePickerCellEditor;
