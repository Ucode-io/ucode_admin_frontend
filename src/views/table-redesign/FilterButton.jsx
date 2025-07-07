import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainActions } from "../../store/main/main.slice";
import { Box, Flex, IconButton, Image } from "@chakra-ui/react";

export const FilterButton = forwardRef(({ view, onClick, ...props }, ref) => {
  const tableViewFiltersOpen = useSelector(
    (state) => state.main.tableViewFiltersOpen
  );
  const dispatch = useDispatch();

  const handleClick = (ev) => {
    if (
      tableViewFiltersOpen ||
      (view?.attributes?.quick_filters?.length > 0 && !tableViewFiltersOpen)
    ) {
      ev.stopPropagation();
      return dispatch(
        mainActions.setTableViewFiltersOpen(!tableViewFiltersOpen)
      );
    }
    onClick(ev);
  };

  return (
    <Box position="relative">
      <IconButton
        ref={ref}
        aria-label="filter"
        icon={<Image src="/img/funnel.svg" alt="filter" />}
        variant="ghost"
        colorScheme="gray"
        onClick={handleClick}
        {...props}
      />
      {Boolean(view?.attributes?.quick_filters?.length) && (
        <Flex
          position="absolute"
          top="-8px"
          right="-4px"
          w="16px"
          h="16px"
          bg="#007AFF"
          alignItems="center"
          justifyContent="center"
          color="#fff"
          borderRadius="50%"
          fontSize="10px"
        >
          {view?.attributes?.quick_filters?.length}
        </Flex>
      )}
    </Box>
  );
});
