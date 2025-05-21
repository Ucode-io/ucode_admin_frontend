import {useDispatch, useSelector} from "react-redux";
import {useParams, useSearchParams} from "react-router-dom";
import useFilters from "../../hooks/useFilters";
import {useTranslation} from "react-i18next";
import {useEffect, useMemo, useRef} from "react";
import {filterActions} from "../../store/filter/filter.slice";
import {Flex} from "@chakra-ui/react";

const FiltersList = ({
  view,
  fieldsMap,
  visibleColumns,
  refetchViews,
  tableLan,
}) => {
  const {tableSlug} = useParams();
  const {new_list} = useSelector((state) => state.filter);
  const [queryParameters] = useSearchParams();
  const filtersOpen = useSelector((state) => state.main.tableViewFiltersOpen);
  const {filters} = useFilters(tableSlug, view?.id);
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const filtersRef = useRef(null);

  useEffect(() => {
    if (queryParameters.get("specialities")?.length) {
      dispatch(
        filterActions.setFilter({
          tableSlug: tableSlug,
          viewId: view?.id,
          name: "specialities_id",
          value: [`${queryParameters.get("specialities")}`],
        })
      );
    }
  }, [queryParameters]);

  const computedFields = useMemo(() => {
    const filter = view?.attributes?.quick_filters ?? [];

    return (
      [
        ...(filter ?? []),
        ...(new_list[tableSlug] ?? [])
          ?.filter(
            (fast) =>
              fast.is_checked &&
              !view?.attributes?.quick_filters?.find(
                (quick) => quick?.id === fast.id
              )
          )
          ?.map((fast) => fast),
      ]
        ?.map((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return fieldsMap[el?.relation_id];
          } else {
            return fieldsMap[el?.id];
          }
        })
        ?.filter((el) => el) ?? []
    );
  }, [view?.attributes?.quick_filters, fieldsMap, new_list, tableSlug]);

  const onChange = (value, name) => {
    dispatch(
      filterActions.setFilter({
        tableSlug: tableSlug,
        viewId: view.id,
        name: name,
        value,
      })
    );
  };

  useEffect(() => {
    if (filtersRef.current) {
      localStorage.setItem("filtersHeight", filtersRef.current.offsetHeight);
    }
  }, []);

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
        refetchViews={refetchViews}>
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

const FilterPopover = ({
  view,
  visibleColumns,
  refetchViews,
  children,
  tableLan,
}) => {
  const ref = useRef();
  const [search, setSearch] = useState("");
  const {i18n} = useTranslation();

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent px="4px" py="8px" ref={ref}>
        <InputGroup mb="8px">
          <InputLeftElement>
            <Image src="/img/search-lg.svg" alt="search" />
          </InputLeftElement>
          <Input
            placeholder={
              generateLangaugeText(
                tableLan,
                i18n?.language,
                "Seaarch by filled name"
              ) || "Search by filled name"
            }
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </InputGroup>
        <FiltersSwitch
          view={view}
          visibleColumns={visibleColumns}
          refetchViews={refetchViews}
          search={search}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FiltersList;
