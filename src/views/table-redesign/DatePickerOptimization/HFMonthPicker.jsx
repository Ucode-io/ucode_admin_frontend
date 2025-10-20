import {MonthPicker} from "@mantine/dates";

const HFMonthPicker = ({
  onChange = () => {},
  value,
}) => {
  return (
    <MonthPicker
      size="sm"
      value={value}
      onChange={onChange}
    />
  );
};

export default HFMonthPicker;
