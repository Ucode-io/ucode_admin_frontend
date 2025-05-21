import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from "@chakra-ui/react";
import {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import {useParams, useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useMutation} from "react-query";
import {quickFiltersActions} from "../../store/filter/quick_filter";
import {mainActions} from "../../store/main/main.slice";
import {filterActions} from "../../store/filter/filter.slice";
import {getColumnIcon} from "./icons";
import constructorViewService from "../../services/constructorViewService";

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

const FiltersSwitch = ({view, visibleColumns, refetchViews, search}) => {
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  const [queryParameters] = useSearchParams();

  const columnsIds = visibleColumns?.map((item) => item?.id);
  const quickFiltersIds = view?.attributes?.quick_filters?.map(
    (item) => item?.id
  );
  const checkedColumns =
    view?.attributes?.quick_filters?.filter((checkedField) =>
      columnsIds?.includes(checkedField?.id)
    ) ?? [];
  const unCheckedColumns =
    (view?.attributes?.quick_filters?.length === 0 ||
    view?.attributes?.quick_filters?.length === undefined
      ? visibleColumns
      : visibleColumns?.filter(
          (column) => !quickFiltersIds?.includes(column?.id)
        )) ?? [];

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column.label;

  const renderColumns = [
    ...checkedColumns.map((c) => ({...c, checked: true})),
    ...unCheckedColumns.map((c) => ({...c, checked: false})),
  ].filter((column) =>
    search === ""
      ? true
      : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

  const mutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      return await refetchViews();
    },
    onSettled: (data) => {
      dispatch(quickFiltersActions.setQuickFiltersCount(data?.length));
    },
  });

  const updateView = async (data, checked) => {
    const result = data?.map((item) => ({
      ...item,
      is_checked: true,
    }));

    await mutation.mutateAsync({
      ...view,
      attributes: {...view?.attributes, quick_filters: result},
    });
    if (view?.attributes?.quick_filters?.length === 0) {
      dispatch(mainActions.setTableViewFiltersOpen(true));
    }
    if (view?.attributes?.quick_filters?.length === 1 && !checked) {
      dispatch(mainActions.setTableViewFiltersOpen(false));
    }
  };

  const onChange = (column, checked) => {
    const quickFilters = view?.attributes?.quick_filters ?? [];

    !checked
      ? dispatch(
          filterActions.clearFilters({
            tableSlug: tableSlug,
            viewId: view?.id,
            name: "specialities_id",
            value: [`${queryParameters.get("specialities")}`],
          })
        )
      : dispatch(
          filterActions.setFilter({
            tableSlug: tableSlug,
            viewId: view?.id,
            name: "specialities_id",
            value: [`${queryParameters.get("specialities")}`],
          })
        );

    updateView(
      checked
        ? [...quickFilters, column]
        : quickFilters.filter((c) => c.id !== column.id),
      checked
    );
  };

  return (
    <Flex flexDirection="column" maxHeight="300px" overflow="auto">
      {renderColumns.map((column) => (
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
            isChecked={column.checked}
            onChange={(ev) => onChange(column, ev.target.checked)}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default FilterPopover;
