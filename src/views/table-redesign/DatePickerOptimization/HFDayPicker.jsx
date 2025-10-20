import {DatePicker, TimeInput} from "@mantine/dates";
import {useState} from "react";
import {isValid, setHours, setMinutes} from "date-fns";

export const HFDayPicker = ({
  withTime = false,
  onChange = () => {},
  disabled,
  value,
}) => {

  const initialDate = getValue(value) || new Date();
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );

  const handleDateChange = (newDate) => {
    if (!newDate) return;
    const [hours, minutes] = time.split(":").map(Number);
    const fullDate = setMinutes(setHours(newDate, hours), minutes);
    setDate(newDate);
    onChange(fullDate);
  };

  const handleTimeChange = (val) => {
    setTime(val);
    const [hours, minutes] = val.split(":").map(Number);
    const fullDate = setMinutes(setHours(date, hours), minutes);
    onChange(fullDate);
  };

      
  return (
    <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      padding: "5px",
    }}>
      <DatePicker
        type="default"
        value={date}
        onChange={handleDateChange}
        valueFormat="DD.MM.YYYY"
        styles={{calendarHeaderControl: {fontSize: 14}}}
        disabled={disabled}
        highlightToday
      />
      {withTime && (
        <TimeInput
          value={time}
          onChange={(event) =>
            handleTimeChange(event.currentTarget.value)
          }
          disabled={disabled}
          format="24"
          clearable={false}
        />
      )}
    </div>
  );
};

const pad = (n) => n.toString().padStart(2, "0");

const getValue = (value) => {
  if (!value || value === "CURRENT_TIMESTAMP") return null;
  if (value instanceof Date && isValid(value)) return value;
  try {
    if (typeof value === "string") {
      if (value.toLowerCase().includes("now")) return new Date();
      const parsed = new Date(value);
      if (isValid(parsed)) return parsed;
    }
    return null;
  } catch (e) {
    return null;
  }
};
