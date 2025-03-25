import {Controller} from "react-hook-form";
import {DatePickerInput, DateTimePicker, TimeInput} from "@mantine/dates";
import {format, isValid, parse} from "date-fns";
import RowClickButton from "../RowClickButton";

export const HFDatePicker = (props) => {
  const {field, setValue, value, data} = props;

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };

  return (
    <>
      {" "}
      <DatePickerInput
        id="dateField"
        value={getValue(value)}
        valueFormat="DD.MM.YYYY"
        rightSection={<img src="/table-icons/date.svg" alt="" />}
        onChange={(value) => {
          if (!value) return;
          const formattedDate = format(value, "yyyy-MM-dd");

          setValue(formattedDate);

          if (props.node && props.column) {
            props.node.setDataValue(props.column.colId, formattedDate);
          }
        }}
        styles={{input: {background: "inherit", border: "none"}}}
        highlightToday
        disabled={field?.disabled}
      />
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} right="30px" />
      )}
    </>
  );
};

export const HFDateTimePicker = (props) => {
  const {field, setValue, value, data} = props;

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };
  return (
    <>
      <DateTimePicker
        id="dateTimeField"
        value={getValue(value)}
        valueFormat="DD.MM.YYYY HH:mm"
        rightSection={<img src="/table-icons/date-time.svg" alt="" />}
        onChange={(value) => {
          if (!value) return;
          const formattedDate = format(value, "yyyy-MM-dd HH:mm");

          setValue(formattedDate);

          if (props.node && props.column) {
            props.node.setDataValue(props.column.colId, formattedDate);
          }
        }}
        styles={{input: {background: "inherit", border: "none"}}}
        highlightToday
        disabled={field?.disabled}
      />
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} right="30px" />
      )}
    </>
  );
};

export const HFDateDatePickerWithoutTimeZoneTable = (props) => {
  const {field, setValue, value, data} = props;

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };
  return (
    <>
      {" "}
      <DateTimePicker
        id="dateTimeZoneField"
        value={getNoTimezoneValue(value)}
        valueFormat="DD.MM.YYYY HH:mm"
        rightSection={<img src="/table-icons/date-time.svg" alt="" />}
        onChange={(value) => {
          if (!value) return;
          const formattedDate = format(value, "dd.MM.yyyy HH:mm");

          setValue(formattedDate);

          if (props.node && props.column) {
            props.node.setDataValue(props.column.colId, formattedDate);
          }
        }}
        styles={{input: {background: "inherit", border: "none"}}}
        highlightToday
        disabled={field?.disabled}
      />
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} right="30px" />
      )}
    </>
  );
};

export const HFTimePicker = (props) => {
  const {field, setValue, value, data} = props;

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };
  return (
    <>
      <TimeInput
        id="timeField"
        value={value}
        rightSection={<img src="/table-icons/time.svg" alt="" />}
        onChange={(value) => {
          if (!value) return;
          const formattedDate = format(value, "yyyy-MM-dd");

          setValue(formattedDate);

          if (props.node && props.column) {
            props.node.setDataValue(props.column.colId, formattedDate);
          }
        }}
        styles={{input: {background: "inherit", border: "none"}}}
        disabled={field?.disabled}
      />
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} right="30px" />
      )}
    </>
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
          console.log("entered 3");
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
