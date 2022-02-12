import { useState, useEffect } from "react";
import Picker from "rc-calendar/lib/Picker";
import RangeCalendar from "rc-calendar/lib/RangeCalendar";
import { ruRU } from "rc-calendar/lib/locale/ru_RU";
import TimePickerPanel from "rc-time-picker/lib/Panel";
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
} from "@material-ui/icons";
import "rc-calendar/assets/index.css";
import "rc-time-picker/assets/index.css";
import "./index.scss";

import moment from "moment";

import "moment/locale/ru";

const timePickerElement = (
  <TimePickerPanel
    defaultValue={[
      moment("00:00:00", "HH:mm:ss"),
      moment("23:59:59", "HH:mm:ss"),
    ]}
  />
);

function newArray(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledTime(time, type) {
  if (type === "start") {
    return {
      disabledHours() {
        const hours = newArray(0, 60);
        hours.splice(20, 4);
        return hours;
      },
      disabledMinutes(h) {
        if (h === 20) {
          return newArray(0, 31);
        } else if (h === 23) {
          return newArray(30, 60);
        }
        return [];
      },
      disabledSeconds() {
        return [55, 56];
      },
    };
  }
  return {
    disabledHours() {
      const hours = newArray(0, 60);
      hours.splice(2, 6);
      return hours;
    },
    disabledMinutes(h) {
      if (h === 20) {
        return newArray(0, 31);
      } else if (h === 23) {
        return newArray(30, 60);
      }
      return [];
    },
    disabledSeconds() {
      return [55, 56];
    },
  };
}

const formatStr = "YYYY-MM-DD";
function format(v) {
  return v ? v.locale("ru").format(formatStr) : "";
}

function isValidRange(v) {
  return v && v[0] && v[1];
}

export default function RangePicker({
  className,
  disabled,
  defaultValue = [],
  dateInputPlaceholder,
  placeholder = "Select a date",
  hideTimePicker = false,
  onChange = () => {},
  ...rest
}) {
  const [value, setValue] = useState([]);
  const [hoverValue, setHoverValue] = useState([]);

  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    setValue(defaultValue ?? undefined);
    setIsEmpty(defaultValue && true);
  }, []);

  const handleClick = (value) => {
    setValue(value);
    onChange(value);
    setIsEmpty(false);
  };

  const onHoverChange = (hoverValue) => {
    setHoverValue(hoverValue);
  };

  const clearInput = () => {
    setValue([]);
    onChange([null, null]);
    setIsEmpty(true);
  };
  // const state = this.state;
  const calendar = (
    <RangeCalendar
      hoverValue={hoverValue}
      onHoverChange={onHoverChange}
      showWeekNumber={false}
      showDateInput={false}
      dateInputPlaceholder={dateInputPlaceholder || ["start", "end"]}
      locale={ruRU}
      disabledTime={disabledTime}
      timePicker={!hideTimePicker ? timePickerElement : null}
      style={{ marginTop: "3rem", width: "100%" }}
    />
  );

  return (
    <Picker
      value={value}
      onChange={handleClick}
      animation="slide-up"
      calendar={calendar}
    >
      {({ value }) => {
        return (
          <div
            className={`border
            bg-white
            flex
            space-x-2
            items-center
            text-body
            relative
            text-gray-600
            font-smaller
            focus-within:outline-none
            rounded-md
            focus-within:border-blue-300
            justify-between
            transition ease-linear
            hover:border-blue-400 
            p-1 px-2 pl-4 ${disabled && "cursor-not-allowed opacity-40"}`}
            {...rest}
          >
            <input
              placeholder={placeholder}
              disabled={disabled}
              readOnly
              value={
                (isValidRange(value) &&
                  `${format(value[0])}   ~   ${format(value[1])}`) ||
                ""
              }
              className={`${disabled ? "cursor-not-allowed" : ""} text-sm`}
              style={{ width: "200px" }}
            />
            {!isEmpty && (
              <CloseIcon
                className="date-input__icons__icon"
                onClick={(e) => {
                  e.stopPropagation();
                  !disabled && clearInput();
                }}
                style={{
                  fontSize: "19px",
                  cursor: "pointer",
                  color: "#aaa",
                }}
              />
            )}
            <CalendarIcon
              style={{ fontSize: "18px", color: "var(--color-primary)" }}
            />
          </div>
        );
      }}
    </Picker>
  );
}
