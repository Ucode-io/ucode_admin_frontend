import {DatePickerInput, DateTimePicker, TimeInput} from "@mantine/dates";
import {Box} from "@mui/material";
import {format, isValid, parse} from "date-fns";
import RowClickButton from "../RowClickButton";

export const HFDatePicker = (props) => {
  const {setValue, value, data, colDef} = props;
  const disabled = colDef?.disabled;

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#0000",

        "&:hover .rowClickButton": {
          display: "block",
        },
      }}>
      <DatePickerInput
        id="dateField"
        value={getValue(value)}
        valueFormat="DD.MM.YYYY"
        rightSection={
          disabled ? (
            <img src="/table-icons/lock.svg" alt="lock" />
          ) : (
            <img src="/table-icons/date.svg" alt="" />
          )
        }
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
        disabled={disabled}
      />

      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} right="30px" />
      {/* )} */}
    </Box>
  );
};

export const HFDateTimePicker = (props) => {
  const {setValue, value, data, colDef} = props;
  const disabled = colDef?.disabled;

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#0000",

        "&:hover .rowClickButton": {
          display: "block",
        },
      }}>
      <DateTimePicker
        id="dateTimeField"
        value={getValue(value)}
        valueFormat="DD.MM.YYYY HH:mm"
        rightSection={
          disabled ? (
            <img src="/table-icons/lock.svg" alt="lock" />
          ) : (
            <img src="/table-icons/date.svg" alt="" />
          )
        }
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
        disabled={disabled}
      />
      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} right="30px" />
      {/* )} */}
    </Box>
  );
};

export const HFDateDatePickerWithoutTimeZoneTable = (props) => {
  const {setValue, value, data, colDef} = props;
  const disabled = colDef?.disabled;

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
        disabled={disabled}
      />
      {props?.colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} right="30px" />
      )}
    </>
  );
};

export const HFTimePicker = (props) => {
  const {setValue, value, data, colDef} = props;
  const disabled = colDef?.disabled;

  const onNavigateToDetail = () => {
    props?.colDef?.onRowClick(data);
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#0000",

        "&:hover .rowClickButton": {
          display: "block",
        },
      }}>
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
        disabled={disabled}
      />
      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} right="30px" />
      {/* )} */}
    </Box>
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
