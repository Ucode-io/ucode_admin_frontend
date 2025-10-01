import { getColumnIcon } from "@/utils/constants/tableIcons";
import { Flex, Switch } from "@chakra-ui/react";
import { useFilterSwitchProps } from "./useFilterSwitchProps";

export const FiltersSwitch = ({ search }) => {

  const { 
    getLabel,
    onChange,
    allColumns,
   } = useFilterSwitchProps({ search });

  return (
    <Flex flexDirection="column" maxHeight="300px" overflow="auto">
      {allColumns.map((column) => (
        <Flex
          key={column.id}
          as="label"
          p="8px"
          columnGap="8px"
          alignItems="center"
          borderRadius={6}
          _hover={{bg: "#EAECF0"}}
          cursor="pointer">
          {column?.type && getColumnIcon({column})}
          {getLabel(column)}
          <Switch
            ml="auto"
            isChecked={!!column.is_checked}
            onChange={(ev) => onChange(column, ev.target.checked)}
          />
        </Flex>
      ))}
    </Flex>
  );
};
