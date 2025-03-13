import {useQuery} from "react-query";
import {Box, Divider} from "@mui/material";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useFieldArray} from "react-hook-form";
import {listToMap} from "../../../utils/listToMap";
import {useEffect, useMemo, useRef, useState} from "react";
import RelationTable from "../RelationSection/RelationTable";
import constructorTableService from "../../../services/constructorTableService";
import FixColumnsRelationSection from "../RelationSection/FixColumnsRelationSection";
import VisibleColumnsButtonRelationSection from "../RelationSection/VisibleColumnsButtonRelationSection";
import RelationTableDrawer from "./RelationTableDrawer";
import chakraUITheme from "@/theme/chakraUITheme";
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
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import {getColumnIcon} from "../../table-redesign/icons";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import {ChevronDownIcon} from "@chakra-ui/icons";
import ViewOptions from "./ViewOptions";

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
  getAllData,
  data,
  tableLan = {},
  tableSlug: tableSlugFromProps,
  handleMouseDown = () => {},
}) => {
  const myRef = useRef();
  const {i18n} = useTranslation();
  const [type, setType] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const {tableSlug: tableSlugFromParams, id: idFromParams, appId} = useParams();
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  );

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
    ["GET_VIEWS_AND_FIELDS", relatedTableSlug, i18n?.language],
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

  return (
    <>
      <Box py={"5px"} sx={{height: "100vh"}}>
        <ChakraProvider theme={chakraUITheme}>
          <Flex gap={"10px"}>
            <Popover>
              <InputGroup ml="auto" w="320px">
                <InputLeftElement>
                  <Image src="/img/search-lg.svg" alt="search" />
                </InputLeftElement>
                <Input
                  placeholder="Search"
                  id="search_input"
                  // defaultValue={searchText}
                  // placeholder={
                  //   generateLangaugeText(tableLan, i18n?.language, "Search") ||
                  //   "Search"
                  // }
                  // onChange={(ev) => inputChangeHandler(ev.target.value)}
                />

                <PopoverTrigger>
                  <InputRightElement>
                    <IconButton
                      w="24px"
                      h="24px"
                      aria-label="more"
                      icon={<Image src="/img/dots-vertical.svg" alt="more" />}
                      variant="ghost"
                      colorScheme="gray"
                      size="xs"
                    />
                  </InputRightElement>
                </PopoverTrigger>
              </InputGroup>

              <PopoverContent
                w="280px"
                p="8px"
                display="flex"
                flexDirection="column"
                maxH="300px"
                overflow="auto">
                {/* {columnsForSearch.map((column) => (
                  <Flex
                    key={column.id}
                    as="label"
                    p="8px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer">
                    {getColumnIcon({column})}
                    <ViewOptionTitle>{column.label}</ViewOptionTitle>
                    <Switch
                      ml="auto"
                      isChecked={column.is_search}
                      onChange={(e) =>
                        updateField({
                          data: {
                            fields: columnsForSearch.map((c) =>
                              c.id === column.id
                                ? {...c, is_search: e.target.checked}
                                : c
                            ),
                          },
                          tableSlug,
                        })
                      }
                    />
                  </Flex>
                ))} */}
              </PopoverContent>
            </Popover>
            <PermissionWrapperV2 tableSlug={tableSlug} type="write">
              <Button
                h={"30px"}
                rightIcon={<ChevronDownIcon fontSize={18} />}
                // onClick={() =>
                //   navigateToForm(
                //     tableSlug,
                //     "CREATE",
                //     {},
                //     {id},
                //     searchParams.get("menuId")
                //   )
                // }
              >
                {/* {generateLangaugeText(tableLan, i18n?.language, "Create item") ||
                "Create item"} */}
                Create item
              </Button>
            </PermissionWrapperV2>

            {/* <IconButton
              aria-label="more"
              icon={<Image src="/img/dots-vertical.svg" alt="more" />}
              variant="ghost"
              colorScheme="gray"
            /> */}

            <ViewOptions
              selectedTab={selectedTab}
              data={data}
              selectedTabIndex={selectedTabIndex}
              // view={view}
              // viewName={viewName}
              // refetchViews={refetchViews}
              fieldsMap={fieldsMap}
              // visibleRelationColumns={visibleRelationColumns}
              // searchText={searchText}
              // checkedColumns={checkedColumns}
              // onDocsClick={onDocsClick}
              // computedVisibleFields={computedVisibleFields}
              // tableLan={tableLan}
            />
          </Flex>
        </ChakraProvider>

        <RelationTableDrawer
          ref={myRef}
          loader={loader}
          remove={remove}
          reset={reset}
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
          tableSlug={tableSlug}
          removableHeight={140}
          id={id}
          getAllData={getAllData}
          type={type}
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
