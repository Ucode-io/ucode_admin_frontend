import {useEffect, useState} from "react";
import {Popover, PopoverTrigger, PopoverContent, Flex} from "@chakra-ui/react";
import {DatePicker, TimeInput} from "@mantine/dates";
import {format} from "date-fns";

import {Chip} from "./chip";
import useDebounce from "@/hooks/useDebounce";
import {useTranslation} from "react-i18next";
import {Box} from "@mui/material";

const YDatePicker = ({
  onChange,
  value: defaultValue,
  field,
  withTime = false,
}) => {
  const start = parseDateFromString(defaultValue?.$gte);
  const end = parseDateFromString(defaultValue?.$lte);
  const {i18n} = useTranslation();

  const [range, setRange] = useState([start, end]);
  const [startTime, setStartTime] = useState(
    start ? format(start, "HH:mm") : ""
  );
  const [endTime, setEndTime] = useState(end ? format(end, "HH:mm") : "");

  const handleRangeChange = (value) => {
    const [start, end] = value ?? [];
    if (!start || !end) {
      return setRange(value);
    }

    if (withTime) {
      const startParsed = parseTimeFromString(startTime, 23, 59);
      const endParsed = parseTimeFromString(endTime, 0, 0);
      start.setHours(startParsed.hours, startParsed.minutes, 0);
      end.setHours(endParsed.hours, endParsed.minutes, 0);
    } else {
      start.setHours(0, 0, 0);
      end.setHours(23, 59, 59);
    }

    onChange({ $gte: start, $lte: end });
    setRange(value);
  };

  const onClearButtonClick = () => {
    onChange(undefined);
    setRange([null, null]);
  };

  const handleTimeChange = useDebounce(() => handleRangeChange(range), 400);

  useEffect(() => {
    handleTimeChange();
  }, [startTime, endTime]);

  const rangeSelected = start instanceof Date && end instanceof Date;

  return (
    <DatePicker
      size="sm"
      type="range"
      allowSingleDateInRange
      value={range}
      onChange={handleRangeChange}
    />
  );
};

const parseDateFromString = (value) => {
  const date = new Date(value);
  return isNaN(date) ? null : date;
};

const parseTimeFromString = (value, fallbackHours, fallbackMinutes) => {
  if (!value) {
    return {hours: fallbackHours, minutes: fallbackMinutes};
  }
  const [hours, minutes] = value.split(":");
  return {hours: Number(hours), minutes: Number(minutes)};
};

export default YDatePicker;
