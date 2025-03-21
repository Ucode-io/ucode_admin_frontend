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
import {useFieldArray} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorTableService from "../../../services/constructorTableService";
import {listToMap} from "../../../utils/listToMap";
import RelationTableDrawer from "./RelationTableDrawer";
import ViewOptions from "./ViewOptions";
import useDebounce from "../../../hooks/useDebounce";
import {generateLangaugeText} from "../../../utils/generateLanguageText";

const DrawerRelationTable = ({
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
  tableSlug: tableSlugFromProps,
  getValues = () => {},
  handleMouseDown = () => {},
}) => {
  const myRef = useRef();
  const {i18n} = useTranslation();
  const [type, setType] = useState(null);
  const {navigateToForm} = useTabRouter();
  const [searchParams] = useSearchParams();
  const [formVisible, setFormVisible] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const {tableSlug: tableSlugFromParams, id: idFromParams, appId} = useParams();
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  );
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const tableSlug = tableSlugFromProps ?? tableSlugFromParams;
  const id = idFromProps ?? idFromParams;

  const getRelatedTabeSlug = useMemo(() => {
    return relations?.find((el) => el?.id === selectedTab?.relation_id);
  }, [relations, selectedTab]);

  const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

  const {fields, remove, update} = useFieldArray({
    control,
    name: "multi",
  });

  const setCreateFormVisible = (relationId, value) => {
    setRelationsCreateFormVisible((prev) => ({
      ...prev,
      [relationId]: value,
    }));
  };

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    setSelectedObjects([]);
    setFormVisible(false);
  }, [selectedTabIndex]);

  useEffect(() => {
    setRelationsCreateFormVisible({
      [data?.id]: false,
    });
  }, [data]);

  const {
    data: {fieldsMap} = {
      views: [],
      fieldsMap: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", relatedTableSlug, i18n?.language, selectedTab],
    () => {
      return constructorTableService.getTableInfo(
        relatedTableSlug,
        {
          data: {},
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      enabled: Boolean(relatedTableSlug),
      select: ({data}) => {
        return {
          fieldsMap: listToMap(data?.fields),
        };
      },
      enabled: !!relatedTableSlug,
    }
  );

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
                rightIcon={<ChevronDownIcon fontSize={18} />}
                onClick={() =>
                  navigateToForm(
                    selectedTab?.relation?.relation_table_slug,
                    "CREATE",
                    {},
                    {id: idFromParams},
                    searchParams.get("menuId")
                  )
                }>
                Create item
              </Button>
            </PermissionWrapperV2>

            <ViewOptions
              selectedTab={selectedTab}
              data={data}
              selectedTabIndex={selectedTabIndex}
              getAllData={getAllData}
              fieldsMap={fieldsMap}
            />
          </Flex>
        </ChakraProvider>

        <RelationTableDrawer
          ref={myRef}
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
          tableSlug={tableSlug}
          removableHeight={140}
          id={id}
          getValues={getValues}
          getAllData={getAllData}
          relatedTable={relatedTable}
          fieldsMap={fieldsMap}
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
