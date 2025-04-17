import {Controller} from "react-hook-form";
import {DatePickerInput, DateTimePicker, TimeInput} from "@mantine/dates";
import {format, isValid, parse} from "date-fns";

export const HFDatePicker = ({
  control,
  name,
  defaultValue = "",
  required,
  updateObject = () => {},
  disabled,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      rules={{
        required: required ? "This field is required" : false,
      }}
      defaultValue={defaultValue === "now()" ? new Date() : defaultValue}
      render={({field: {onChange, value}}) => {
        return (
          <DatePickerInput
            id="dateField"
            value={getValue(value)}
            valueFormat="DD.MM.YYYY"
            rightSection={<img src="/table-icons/date.svg" alt="" />}
            onChange={(value) => {
              onChange(value);
              updateObject();
            }}
            styles={{input: {background: "inherit", border: "none"}}}
            highlightToday
            disabled={disabled}
          />
        );
      }}
    />
  );
};

export const HFDateTimePicker = ({
  control,
  name,
  defaultValue = "",
  required,
  updateObject,
  disabled,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      rules={{
        required: required ? "This field is required" : false,
      }}
      defaultValue={defaultValue === "now()" ? new Date() : defaultValue}
      render={({field: {onChange, value}}) => {
        return (
          <DateTimePicker
            id="dateTimeField"
            value={getValue(value)}
            valueFormat="DD.MM.YYYY HH:mm"
            rightSection={<img src="/table-icons/date-time.svg" alt="" />}
            onChange={(value) => {
              onChange(value);
              updateObject();
            }}
            styles={{input: {background: "inherit", border: "none"}}}
            highlightToday
            disabled={disabled}
          />
        );
      }}
    />
  );
};

export const HFDateDatePickerWithoutTimeZoneTable = ({
  control,
  name,
  defaultValue = "",
  required,
  updateObject,
  disabled,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      rules={{
        required: required ? "This field is required" : false,
      }}
      defaultValue={defaultValue === "now()" ? new Date() : defaultValue}
      render={({field: {onChange, value}}) => {
        return (
          <DateTimePicker
            id="dateTimeZoneField"
            value={getNoTimezoneValue(value)}
            valueFormat="DD.MM.YYYY HH:mm"
            rightSection={<img src="/table-icons/date-time.svg" alt="" />}
            onChange={(value) => {
              onChange(
                value ? format(new Date(value), "dd.MM.yyyy HH:mm") : ""
              );
              updateObject();
            }}
            styles={{input: {background: "inherit", border: "none"}}}
            highlightToday
            disabled={disabled}
          />
        );
      }}
    />
  );
};

export const HFTimePicker = ({
  control,
  name,
  required,
  updateObject,
  disabled,
}) => {
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
          <TimeInput
            id="timeField"
            value={value}
            rightSection={<img src="/table-icons/time.svg" alt="" />}
            onChange={(value) => {
              onChange(value);
              updateObject();
            }}
            styles={{input: {background: "inherit", border: "none"}}}
            disabled={disabled}
          />
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
      if (value.includes("Z")) {
        const parsedISO = new Date(value);
        if (isValid(parsedISO)) {
          return parsedISO;
        }
      } else {
        const parsedISO = new Date(value);
        return parsedISO;
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
  if (!value) return "";
  if (value instanceof Date && isValid(value)) return value;

  try {
    if (value.includes("Z")) return new Date(value);
    const parsedDate = parse(value, "dd.MM.yyyy HH:mm", new Date());
    return isValid(parsedDate) ? parsedDate : "";
  } catch (e) {
    return "";
  }
};
