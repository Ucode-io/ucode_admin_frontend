import {YearPicker} from "@mantine/dates";
import {format} from "date-fns";
import {useEffect, useState} from "react";
import useDebounce from "@/hooks/useDebounce";
import {useTranslation} from "react-i18next";
import {Controller} from "react-hook-form";

const HFYearPicker = ({
  control,
  name,
  field,
  placeholder,
  updateObject = () => {},
  withTime,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value}}) => (
        <YearPicker
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

export default HFYearPicker;
