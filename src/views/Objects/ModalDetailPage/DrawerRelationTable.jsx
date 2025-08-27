import chakraUITheme from "@/theme/chakraUITheme";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Button,
  ChakraProvider,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import {Box} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import useTabRouter from "../../../hooks/useTabRouter";
import RelationTableDrawer from "./RelationTableDrawer";
import ViewOptions from "./ViewOptions";
import useDebounce from "../../../hooks/useDebounce";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import constructorObjectService from "../../../services/constructorObjectService";
import {useQuery} from "react-query";
import {pageToOffset} from "../../../utils/pageToOffset";
import {useSelector} from "react-redux";
import {objectToArray} from "../../../utils/objectToArray";
import {listToMap, listToMapWithoutRel} from "../../../utils/listToMap";
import BoardView from "../BoardView";

const DrawerRelationTable = ({
  layoutTabs,
  selectedTabIndex,
  relations,
  loader,
  id: idFromProps,
  control,
  reset,
  setFormValue,
  watch,
  selectedTab,
  getAllData = () => {},
  data,
  tableLan = {},
  relatedTable,
  tableSlug,
  menuItem,
  layoutType,
  setLayoutType = () => {},
  getValues = () => {},
  handleMouseDown = () => {},
  setSelectedTabIndex = () => {},
}) => {
  const myRef = useRef();
  const {i18n} = useTranslation();
  const {navigateToForm} = useTabRouter();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formVisible, setFormVisible] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const {menuId} = useParams();
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  );
  const settingsForm = useForm({
    defaultValues: {
      calendar_from_slug: "",
      calendar_to_slug: "",
    },
  });

  const { id: idFromParams } = useParams();

  const id = searchParams.get("p") || idFromParams || idFromProps;
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [limit, setLimit] = useState(10);
  const paginationInfo = useSelector(
    (state) => state?.pagination?.paginationInfo
  );

  const getRelatedTabeSlug = useMemo(() => {
    return relations?.find((el) => el?.id === selectedTab?.relation_id);
  }, [relations, selectedTab]);

  const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

  const { fields, remove, update } = useFieldArray({
    control,
    name: "multi",
  });

  const paginiation = useMemo(() => {
    const getObject = paginationInfo.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageLimit ?? limit;
  }, [paginationInfo, tableSlug]);

  const limitPage = useMemo(() => {
    if (typeof paginiation === "number") {
      return paginiation;
    } else if (paginiation === "all" && limit === "all") {
      return undefined;
    } else {
      return pageToOffset(currentPage, limit);
    }
  }, [paginiation, limit, currentPage]);

  function customSortArray(a, b) {
    const commonItems = a?.filter((item) => b.includes(item));
    commonItems?.sort();
    const remainingItems = a?.filter((item) => !b.includes(item));
    const sortedArray = commonItems?.concat(remainingItems);
    return sortedArray;
  }

  const computedFilters = useMemo(() => {
    const relationFilter = {};

    if (getRelatedTabeSlug?.type === "Many2Many")
      relationFilter[`${tableSlug}_ids`] = id;
    else if (getRelatedTabeSlug?.type === "Many2Dynamic")
      relationFilter[
        `${getRelatedTabeSlug?.relation_field_slug}.${tableSlug}_id`
      ] = id;
    else if (
      getRelatedTabeSlug?.relation_index &&
      getRelatedTabeSlug?.relation_index > 1
    )
      relationFilter[`${tableSlug}_id_${getRelatedTabeSlug?.relation_index}`] =
        id;
    else relationFilter[`${tableSlug}_id`] = id;
    return {
      ...filters,
      ...relationFilter,
    };
  }, [
    filters,
    tableSlug,
    id,
    getRelatedTabeSlug?.type,
    getRelatedTabeSlug?.relation_field_slug,
  ]);

  console.log(computedFilters);

  const {
    data: {
      tableData = [],
      pageCount = 1,
      columns = [],
      quickFilters = [],
      fieldsMap = {},
      fieldsMapRel = {},
      visibleColumns = [],
      count = 0,
    } = {},
    refetch,
    isLoading: dataFetchingLoading,
  } = useQuery(
    [
      "GET_OBJECT_LIST",
      relatedTableSlug,
      {
        filters: computedFilters,
        offset: pageToOffset(currentPage, limit),
        limit,
        searchText,
      },
      selectedTab,
    ],
    () => {
      return constructorObjectService.getList(
        relatedTableSlug,
        {
          data: {
            offset: pageToOffset(currentPage, limit),
            limit: limitPage !== 0 ? limitPage : limit,
            from_tab: true,
            search: searchText,
            ...computedFilters,
          },
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      enabled: !!relatedTableSlug,
      select: ({data}) => {
        const tableData = data?.response || [];
        const pageCount =
          isNaN(data?.count) || tableData.length === 0
            ? 1
            : Math.ceil(data.count / paginiation);
        const fieldsMap = listToMap(data.fields);
        const fieldsMapRel = listToMapWithoutRel(data?.fields ?? []);
        const count = data?.count;
        const visibleColumns = data?.fields ?? [];

        const array = [];
        for (const key in getRelatedTabeSlug?.attributes?.fixedColumns) {
          if (
            getRelatedTabeSlug?.attributes?.fixedColumns.hasOwnProperty(key)
          ) {
            if (getRelatedTabeSlug?.attributes?.fixedColumns[key])
              array.push({
                id: key,
                value: getRelatedTabeSlug?.attributes?.fixedColumns?.[key],
              });
          }
        }

        const columns = customSortArray(
          (Array.isArray(layoutTabs?.[selectedTabIndex]?.attributes?.columns)
            ? layoutTabs?.[selectedTabIndex]?.attributes?.columns
            : []) ?? getRelatedTabeSlug?.columns,
          array.map((el) => el.id)
        )
          ?.map((el) => fieldsMap[el])
          ?.filter((el) => el);

        const quickFilters = getRelatedTabeSlug.quick_filters
          ?.map(({field_id}) => fieldsMap[field_id])
          ?.filter((el) => el);

        return {
          tableData,
          pageCount,
          columns,
          quickFilters,
          fieldsMap,
          visibleColumns,
          fieldsMapRel,
          count,
        };
      },
      onSuccess: () => {
        setFormValue("multi", tableData);
      },
    }
  );

  const setCreateFormVisible = (relationId, value) => {
    setRelationsCreateFormVisible((prev) => ({
      ...prev,
      [relationId]: value,
    }));
  };
  console.log("tableDataform", tableData);
  // useEffect(() => {
  //   update();
  // }, [update]);

  useEffect(() => {
    setSelectedObjects([]);
    setFormVisible(false);
  }, [selectedTabIndex]);

  useEffect(() => {
    setRelationsCreateFormVisible({
      [data?.id]: false,
    });
  }, [data]);

  const inputChangeHandler = useDebounce((val) => {
    setCurrentPage(1);
    setSearchText(val);
  }, 300);

  return (
    <>
      <Box py={"5px"} sx={{height: "100vh"}}>
        <ChakraProvider theme={chakraUITheme}>
          <Flex
            px={3}
            mb={"10px"}
            gap={"10px"}
            justifyContent={"space-between"}>
            <Popover>
              <InputGroup ml="auto" w="320px">
                <InputLeftElement>
                  <Image src="/img/search-lg.svg" alt="search" />
                </InputLeftElement>
                <Input
                  id="search_input"
                  defaultValue={searchText}
                  placeholder={
                    generateLangaugeText(tableLan, i18n?.language, "Search") ||
                    "Search"
                  }
                  onChange={(ev) => inputChangeHandler(ev.target.value)}
                />
              </InputGroup>

              <PopoverContent
                w="280px"
                p="8px"
                display="flex"
                flexDirection="column"
                maxH="300px"
                overflow="auto"></PopoverContent>
            </Popover>
            <PermissionWrapperV2 tableSlug={tableSlug} type="write">
              <Button
                h={"30px"}
                onClick={() =>
                  navigate(`/${menuId}/detail/create`, {
                    state: {
                      tableSlug: relatedTableSlug,
                    },
                  })
                }>
                Create item
              </Button>
            </PermissionWrapperV2>

            <ViewOptions
              settingsForm={settingsForm}
              tableSlug={tableSlug}
              selectedTab={selectedTab}
              data={data}
              selectedTabIndex={selectedTabIndex}
              getAllData={getAllData}
              fieldsMap={fieldsMap}
            />
          </Flex>
        </ChakraProvider>

        <RelationTableDrawer
          refetch={refetch}
          count={count}
          pageCount={pageCount}
          columns={columns}
          dataFetchingLoading={dataFetchingLoading}
          tableData={tableData}
          fieldsMap={fieldsMap}
          limit={limit}
          setLimit={setLimit}
          setFilters={setFilters}
          filters={filters}
          ref={myRef}
          tableSlug={tableSlug}
          loader={loader}
          remove={remove}
          reset={reset}
          searchText={searchText}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          selectedTabIndex={selectedTabIndex}
          watch={watch}
          selectedTab={selectedTab}
          control={control}
          setFormValue={setFormValue}
          fields={fields}
          setFormVisible={setFormVisible}
          formVisible={formVisible}
          key={selectedTab.id}
          relation={relations}
          getRelatedTabeSlug={getRelatedTabeSlug}
          createFormVisible={relationsCreateFormVisible}
          setCreateFormVisible={setCreateFormVisible}
          selectedObjects={selectedObjects}
          setSelectedObjects={setSelectedObjects}
          inputChangeHandler={inputChangeHandler}
          removableHeight={140}
          id={id}
          getValues={getValues}
          getAllData={getAllData}
          relatedTable={relatedTable}
          type={"relation"}
          layoutData={data}
        />
      </Box>

      <Box
        onMouseDown={handleMouseDown}
        sx={{
          position: "absolute",
          height: "calc(100vh - 50px)",
          width: "3px",
          left: 0,
          top: 0,
          cursor: "col-resize",
        }}
      />
    </>
  );
};

export default DrawerRelationTable;
