import {Controller} from "react-hook-form";
import {DatePickerInput, DateTimePicker, TimeInput} from "@mantine/dates";
import {format, isValid, parse, parseISO} from "date-fns";
import "./style.scss";
import {Box} from "@chakra-ui/react";
import {Lock} from "@mui/icons-material";
import useDebounce from "@/hooks/useDebounce";

export const HFDatePickerField = ({
  control,
  name,
  defaultValue = "",
  required,
  disabled,
  drawerDetail = false,
  placeholder = "",
  updateObject = () => {},
}) => {
  const inputUpdateObject = useDebounce(() => updateObject(), 500);
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      rules={{
        required: required ? "This field is required" : false,
      }}
      defaultValue={defaultValue || undefined}
      render={({field: {onChange, value}}) => {
        return (
          <Box position="relative" zIndex={100}>
            <DatePickerInput
              placeholder={placeholder}
              id="dateField"
              value={
                value && isValid(new Date(value))
                  ? new Date(value)
                  : value
                    ? parse(value, "yyyy-MM-dd", new Date())
                    : undefined
              }
              valueFormat="DD.MM.YYYY"
              rightSection={
                drawerDetail ? "" : <img src="/table-icons/date.svg" alt="" />
              }
              onChange={(value) => {
                onChange(value ? format(new Date(value), "yyyy-MM-dd") : "");
                inputUpdateObject();
              }}
              styles={{
                input: {
                  background: "inherit",
                  border: "none",
                  "&:hover": {
                    background: "red",
                  },
                  fontSize: "13px",
                  color: "#787774",
                },
              }}
              highlightToday
              disabled={disabled}
              className="datePickerInput"
            />
            {disabled && (
              <Box
                sx={{
                  width: "2.5rem",
                  height: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  right: "1px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <Lock style={{ fontSize: "20px", color: "#adb5bd" }} />
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export const HFDateTimePickerField = ({
  control,
  name,
  defaultValue = "",
  required,
  disabled,
  placeholder = "",
  drawerDetail = false,
  updateObject = () => {},
}) => {
  const inputUpdateObject = useDebounce(() => updateObject(), 500);
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      rules={{
        required: required ? "This field is required" : false,
      }}
      defaultValue={defaultValue}
      render={({field: {onChange, value}}) => {
        return (
          <Box position="relative">
            <DateTimePicker
              placeholder={placeholder}
              id="dateTimeField"
              value={getValue(value) ?? defaultValue}
              valueFormat="DD.MM.YYYY HH:mm"
              rightSection={
                drawerDetail ? (
                  ""
                ) : (
                  <img src="/table-icons/date-time.svg" alt="" />
                )
              }
              onChange={(value) => {
                onChange(value);
                inputUpdateObject();
              }}
              styles={{
                input: {
                  background: "inherit",
                  border: "none",
                  width: "330px",
                  fontSize: "13px",
                  color: "#787774",
                },
              }}
              highlightToday
              disabled={disabled}
              className="dateTimePickerInput"
            />
            {disabled && (
              <Box
                sx={{
                  width: "2.5rem",
                  height: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  right: "1px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}>
                <Lock style={{fontSize: "20px", color: "#adb5bd"}} />
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export const HFDateDatePickerWithoutTimeZoneTableField = ({
  control,
  name,
  defaultValue = "",
  required,
  disabled,
  placeholder = "",
  drawerDetail = false,
  updateObject = () => {},
}) => {
  const inputUpdateObject = useDebounce(() => updateObject(), 500);
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      rules={{
        required: required ? "This field is required" : false,
      }}
      defaultValue={defaultValue}
      render={({field: {onChange, value}}) => {
        return (
          <Box position="relative">
            <DateTimePicker
              placeholder={placeholder}
              id="dateTimeZoneField"
              value={value ? getNoTimezoneValue(value) : defaultValue}
              valueFormat="DD.MM.YYYY HH:mm"
              rightSection={
                drawerDetail ? (
                  ""
                ) : (
                  <img src="/table-icons/date-time.svg" alt="" />
                )
              }
              onChange={(value) => {
                onChange(
                  value ? format(new Date(value), "dd.MM.yyyy HH:mm") : ""
                );
                inputUpdateObject();
              }}
              styles={{
                input: {
                  background: "inherit",
                  border: "none",
                  width: "330px",
                  fontSize: "13px",
                  color: "#787774",
                },
              }}
              highlightToday
              disabled={disabled}
            />
            {disabled && (
              <Box
                sx={{
                  width: "2.5rem",
                  height: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  right: "1px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}>
                <Lock style={{fontSize: "20px", color: "#adb5bd"}} />
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export const HFTimePickerField = ({
  control,
  name,
  required,
  disabled,
  placeholder = "",
  drawerDetail = false,
  updateObject = () => {},
}) => {
  const inputUpdateObject = useDebounce(() => updateObject(), 500);
  return (
    <Controller
      control={control}
      name={name}
      disabled
      rules={{
        required: required ? "This field is required" : false,
      }}
      render={({field: {onChange, value}}) => {
        return (
          <Box position="relative">
            {disabled && (
              <Box
                sx={{
                  width: "2.5rem",
                  height: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  right: "1px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}>
                <Lock style={{fontSize: "20px", color: "#adb5bd"}} />
              </Box>
            )}
            <TimeInput
              id="timeField"
              value={value}
              rightSection={
                drawerDetail ? "" : <img src="/table-icons/time.svg" alt="" />
              }
              onChange={(value) => {
                onChange(value);
                inputUpdateObject();
              }}
              styles={{
                input: {
                  background: "inherit",
                  border: "none",
                  width: "330px",
                  fontSize: "13px",
                  color: "#787774",
                },
              }}
              placeholder={placeholder}
              disabled={disabled}
            />
          </Box>
        );
      }}
    />
  );
};

const getValue = (value) => {
  if (!value) return null;
  if (value instanceof Date && isValid(value)) return value;

  try {
    if (typeof value === "string") {
      if (value.toLowerCase().includes("now")) return new Date();

      if (value.endsWith("Z")) {
        const parsedISO = new Date(value);
        if (isValid(parsedISO)) return parsedISO;
      }

      const formats = [
        "yyyy-MM-dd HH:mm",
        "dd.MM.yyyy HH:mm",
        "yyyy-MM-dd'T'HH:mm:ssX",
        "yyyy-MM-dd'T'HH:mm:ss.SSSX",
      ];

      for (const fmt of formats) {
        const parsedDate = parse(value, fmt, new Date());
        if (isValid(parsedDate)) return parsedDate;
      }
    }
    return null;
  } catch (e) {
    return null;
  }
};
const getNoTimezoneValue = (value) => {
  if (!value) return null;
  if (value instanceof Date && isValid(value)) return value;

  try {
    if (typeof value === "string" && value.includes("Z"))
      return new Date(value);
    const parsedDate = parse(value, "dd.MM.yyyy HH:mm", new Date());
    return isValid(parsedDate) ? parsedDate : null;
  } catch (e) {
    return null;
  }
};
