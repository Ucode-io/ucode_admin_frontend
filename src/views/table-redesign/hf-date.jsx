import {Controller} from "react-hook-form";
import {DatePickerInput, DateTimePicker, TimeInput} from "@mantine/dates";
import {format, parse} from "date-fns";

export const HFDatePicker = ({control, name, defaultValue = "", required, updateObject, disabled}) => {
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
        return <DatePickerInput
          value={getValue(value)}
          valueFormat="DD.MM.YYYY"
          rightSection={<img src="/table-icons/date.svg" alt=""/>}
          onChange={(value) => {
            onChange(value);
            updateObject();
          }}
          styles={{ input: { background: "inherit", border: "none" } }}
          highlightToday
          disabled={disabled}
        />
      }}
    />
  )
}

export const HFDateTimePicker = ({control, name, defaultValue = "", required, updateObject, disabled}) => {
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
        return <DateTimePicker
          value={getValue(value)}
          valueFormat="DD.MM.YYYY HH:mm"
          rightSection={<img src="/table-icons/date-time.svg" alt=""/>}
          onChange={(value) => {
            onChange(value);
            updateObject();
          }}
          styles={{ input: { background: "inherit", border: "none" } }}
          highlightToday
          disabled={disabled}
        />
      }}
    />
  )
}

export const HFDateDatePickerWithoutTimeZoneTable = ({control, name, defaultValue = "", required, updateObject, disabled}) => {
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
        return <DateTimePicker
          value={getNoTimezoneValue(value)}
          valueFormat="DD.MM.YYYY HH:mm"
          rightSection={<img src="/table-icons/date-time.svg" alt=""/>}
          onChange={(value) => {
            onChange(value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "");
            updateObject();
          }}
          styles={{ input: { background: "inherit", border: "none" } }}
          highlightToday
          disabled={disabled}
        />
      }}
    />
  )
}

export const HFTimePicker = ({control, name,  required, updateObject, disabled}) => {
  return (
    <Controller
      control={control}
      name={name}
      disabled
      rules={{
        required: required ? "This field is required" : false,
      }}
      render={({field: {onChange, value}}) => {
        return <TimeInput
          value={value}
          rightSection={<img src="/table-icons/time.svg" alt=""/>}
          onChange={(value) => {
            onChange(value);
            updateObject();
          }}
          styles={{ input: { background: "inherit", border: "none" } }}
          disabled={disabled}
        />
      }}
    />
  )
}

const getValue = (value) => {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value
  }

  try {
    return value === 'now()' ? new Date() : new Date(value);
  } catch (e) {
    return null;
  }
}

const getNoTimezoneValue = (value) => {
  if (!value) return "";

  if (value.includes("Z")) return new Date(value);

  return parse(value, "dd.MM.yyyy HH:mm", new Date());
}