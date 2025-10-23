import {YearPicker} from "@mantine/dates";

const HFYearPicker = ({
  onChange = () => {},
  value,
}) => {
  return (
    <YearPicker
      size="sm"
      value={value}
      onChange={(e) => {
        onChange(e);
      }}
    />
  );
};

export default HFYearPicker;
