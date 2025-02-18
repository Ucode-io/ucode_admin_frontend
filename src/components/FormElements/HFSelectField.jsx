import {Box, MenuItem, Select} from "@chakra-ui/react";
import React, {useState} from "react";
import {Controller} from "react-hook-form";

const HFSelectField = ({
  control,
  name,
  label,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required = false,
  onChange = () => {},
  onOpen = () => {},
  getOnchangeField = () => {},
  optionType = "",
  defaultValue = "",
  rules = {},
  id,
  isClearable = true,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleClear = () => {
    setSelectedValue("");
    onChange("");
  };

  return (
    <Box width={"150px"}>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}}) => {
          return (
            <Select
              w={"100%"}
              onChange={(e) => onChange(e.target.value)}
              options={options}>
              {options?.map((option) => (
                <option>{option?.label}</option>
              ))}
            </Select>
          );
        }}
      />
    </Box>
  );
};

export default HFSelectField;
