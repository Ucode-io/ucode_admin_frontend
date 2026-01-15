import { Box, Button } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useDefaultFiltersProps } from "./useDefaultFiltersProps";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

import cls from "./styles.module.scss";

export const DefaultFilters = ({ onBackClick, handleClosePopover }) => {

  const { allFields, i18n, filterGenerator, updateDefaultFilter } =
    useDefaultFiltersProps({ handleClosePopover });

  return (
    <Box className={cls.defaultFilters}>
      <Box>
        <Button
          leftIcon={<ChevronLeftIcon fontSize={22} />}
          colorScheme="gray"
          variant="ghost"
          w="fit-content"
          onClick={() => {
            onBackClick();
          }}
        >
          <Box color="#475467" fontSize={16} fontWeight={600}>
            Default filters
          </Box>
        </Button>
      </Box>
      <Box maxHeight="300px" overflow="auto" marginTop="10px">
        {allFields.map((item, index) => (
          <Box className={cls.item} key={index}>
            <Box className={cls.label}>
              {item.attributes?.[`label_${i18n.language}`] ||
                item.attributes?.label ||
                item.label ||
                ""}
            </Box>
            <Box className={cls.value}>{filterGenerator(item)}</Box>
          </Box>
        ))}
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        paddingTop="6px"
        borderTop="1px solid #E2E8F0"
      >
        <PrimaryButton onClick={updateDefaultFilter}>Save</PrimaryButton>
      </Box>
    </Box>
  );
};