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
  onChange = () => {},
  onOpen = () => {},
  getOnchangeField = () => {},
  optionType = "",
  defaultValue = "",
  rules = {},
  id,
  isClearable = true,
  required = false,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleClear = () => {
    setSelectedValue("");
    onChange("");
  };

  return (
    <Box
      width={width ? width : "120px"}
      display={"flex"}
      alignItems={"center"}
      flexDirection={"column"}>
      <Controller
        control={control}
        rules={{
          required: required ? "This is required field" : false,
        }}
        name={name}
        render={({field: {onChange, value}, fieldState: {error}}) => {
          return (
            <>
              <Select
                required={required}
                w={"100%"}
                onChange={(e) => onChange(e.target.value)}
                options={options}>
                <option defaultChecked disabled>
                  Choose value
                </option>
                {options?.map((option) => (
                  <option>{option?.label}</option>
                ))}
              </Select>

              {name === error?.ref?.name && (
                <span
                  style={{
                    fontSize: "10px",
                    width: "100%",
                    color: "red",
                    marginLeft: "15px",
                  }}>
                  {error?.message}
                </span>
              )}
            </>
          );
        }}
      />
    </Box>
  );
};

export default HFSelectField;
