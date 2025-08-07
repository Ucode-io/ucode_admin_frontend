import {MonthPicker} from "@mantine/dates";
import {Controller} from "react-hook-form";

const HFMonthPicker = ({control, name, updateObject = () => {}}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, value}}) => (
        <MonthPicker
          size="sm"
          value={value}
          onChange={(e) => {
            onChange(e);
            updateObject();
          }}
        />
      )}
    />
  );
};

export default HFMonthPicker;
