import {useMemo} from "react";
import {Box, Popover, PopoverTrigger, PopoverContent} from "@chakra-ui/react";

import {Chip} from "./chip";

const BooleanFilter = ({
                         onChange = () => {
                         }, field, filters, name,
                       }) => {
  const value = useMemo(() => {
    if (filters[name] === true) return "true";
    if (filters[name] === false) return "false";
    return "";
  }, [filters, name]);

  return (
    <Popover>
      <PopoverTrigger>
        <Chip showCloseIcon={value !== ""} onClearButtonClick={() => onChange(undefined, name)}>
          {value || field.label}
        </Chip>
      </PopoverTrigger>
      <PopoverContent w='fit-content'>
        <Box px='40px' py='4px' cursor="pointer" bg={value === "true" ? "#eee" : "#fff"} _hover={{bg: "#eee"}}
             onClick={() => onChange(true, name)}>
          {field.attributes?.text_true ?? "Да"}
        </Box>
        <Box px='40px' py='4px' cursor="pointer" bg={value === "false" ? "#eee" : "#fff"} _hover={{bg: "#eee"}}
             onClick={() => onChange(false, name)}>
          {field.attributes?.text_false ?? "Нет"}
        </Box>
      </PopoverContent>
    </Popover>
  );
};

export default BooleanFilter;
