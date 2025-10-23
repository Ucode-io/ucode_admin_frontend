import { Box, Flex } from "@chakra-ui/react";
import { FilterPopover } from "../FilterPopover";
import InlineSVG from "react-inlinesvg";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import { Filter } from "../FilterGenerator";
import { useSelector } from "react-redux";
import { useFiltersListProps } from "./useFiltersListProps";

export const FiltersList = () => {

  const { i18n, filtersRef, computedFields, onChange, tableSlug, visibleColumns, refetchViews, filters, view, tableLan } = useFiltersListProps();

  const filtersOpen = useSelector((state) => state.main.tableViewFiltersOpen);

  if (!filtersOpen) {
    return;
  }

  return (
    <Flex
      ref={filtersRef}
      minH="max-content"
      px="16px"
      py="6px"
      bg="#fff"
      alignItems="center"
      gap="6px"
      borderBottom="1px solid #EAECF0"
      flexWrap="wrap"
      id="filterHeight">
      <FilterPopover
        tableLan={tableLan}
        view={view}
        visibleColumns={visibleColumns}
        refetchViews={refetchViews}
        tableSlug={tableSlug}>
        <Flex
          alignItems="center"
          columnGap="4px"
          border="1px solid #EAECF0"
          borderRadius={32}
          color="#FFFFFF70"
          py="1px"
          px="8px"
          cursor="pointer"
          _hover={{bg: "#f3f3f3"}}>
          <InlineSVG
            src="/img/plus-icon.svg"
            width={14}
            height={14}
            color="#909EAB"
          />
          <Box color="#909EAB">
            {generateLangaugeText(tableLan, i18n?.language, "Add filter") ||
              "Add filter"}
          </Box>
        </Flex>
      </FilterPopover>

      {computedFields?.map((filter) => (
        <div key={filter.id}>
          <Filter
            field={filter}
            name={filter?.path_slug || filter.slug}
            tableSlug={tableSlug}
            filters={filters}
            onChange={onChange}
          />
        </div>
      ))}
    </Flex>
  );
};
