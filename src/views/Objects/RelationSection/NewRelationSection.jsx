import MultipleInsertButton from "@/views/Objects/components/MultipleInsertForm";
import {InsertDriveFile} from "@mui/icons-material";
import {Card, Divider} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import {useFieldArray} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import PageFallback from "../../../components/PageFallback";
import constructorTableService from "../../../services/constructorTableService";
import layoutService from "../../../services/layoutService";
import {store} from "../../../store";
import {listToMap} from "../../../utils/listToMap";
import FilesSection from "../FilesSection";
import NewMainInfo from "../NewMainInfo";
import CustomActionsButton from "../components/CustomActionsButton";
import FixColumnsRelationSection from "./FixColumnsRelationSection";
import ManyToManyRelationCreateModal from "./ManyToManyRelationCreateModal";
import RelationTable from "./RelationTable";
import VisibleColumnsButtonRelationSection from "./VisibleColumnsButtonRelationSection";
import styles from "./style.module.scss";

const NewRelationSection = ({
  selectedTabIndex,
  setSelectedTabIndex,
  relations,
  loader,
  getAllData,
  tableSlug: tableSlugFromProps,
  id: idFromProps,
  limit,
  setLimit,
  relatedTable,
  control,
  getValues,
  reset,
  setFormValue,
  watch,
  setSelectTab,
  selectedTab,
  errors,
}) => {
  const [data, setData] = useState([]);
  const {tableSlug: tableSlugFromParams, id: idFromParams, appId} = useParams();
  const tableSlug = tableSlugFromProps ?? tableSlugFromParams;
  const id = idFromProps ?? idFromParams;
  const menuItem = store.getState().menu.menuItem;
  const [selectedManyToManyRelation, setSelectedManyToManyRelation] =
    useState(null);
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  );
  const {i18n} = useTranslation();
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [type, setType] = useState(null);
  let [searchParams] = useSearchParams();
  const queryTab = searchParams.get("tab");
  const myRef = useRef();

  const filteredRelations = useMemo(() => {
    if (data?.table_id) {
      return data?.type;
    }
  }, [data]);

  const getRelatedTabeSlug = useMemo(() => {
    return relations?.find((el) => el?.id === selectedTab?.relation_id);
  }, [relations, selectedTab]);

  useEffect(() => {
    if (data?.[0]?.tabs?.length > 0) {
      setSelectTab(data?.[0]?.tabs?.[0]);
    }
  }, [data, setSelectTab]);

  useEffect(() => {
    queryTab
      ? setSelectedTabIndex(parseInt(queryTab) - 1)
      : setSelectedTabIndex(0);
  }, [queryTab, setSelectedTabIndex]);

  const {fields, remove, update} = useFieldArray({
    control,
    name: "multi",
  });

  useEffect(() => {
    update();
  }, [update]);

  const selectedRelation = filteredRelations?.[selectedTabIndex];
  useEffect(() => {
    setSelectedObjects([]);
    setFormVisible(false);
  }, [selectedTabIndex]);

  useEffect(() => {
    const result = {
      [filteredRelations?.id]: false,
    };

    setRelationsCreateFormVisible(result);
  }, [filteredRelations]);

  const setCreateFormVisible = (relationId, value) => {
    setRelationsCreateFormVisible((prev) => ({
      ...prev,
      [relationId]: value,
    }));
  };

  /*****************************JWT START*************************/

  const computedSections = useMemo(() => {
    const sections = [];
    data?.tabs?.[selectedTabIndex]?.sections?.map((el) => {
      return !sections?.[el] && sections.push(el);
    });
    return sections;
  }, [data, selectedTabIndex]);

  const onSelect = (el) => {
    setType(el?.type);
    setSelectTab(el ?? relations[selectedTabIndex]);
  };

  /*****************************JWT END*************************/

  useEffect(() => {
    layoutService
      .getLayout(tableSlug, appId, {
        "table-slug": tableSlug,
        language_setting: i18n?.language,
      })
      .then((res) => {
        const layout = {
          ...res,
          tabs: res?.tabs?.filter(
            (tab) =>
              tab?.relation?.permission?.view_permission === true ||
              tab?.type === "section"
          ),
        };
        setData(layout);
      });
  }, [tableSlug, menuItem.table_id, i18n?.language]);

  const isMultiLanguage = useMemo(() => {
    const allFields = [];
    selectedTab?.sections?.map((section) => {
      return section?.fields?.map((field) => {
        return allFields.push(field);
      });
    });
    return !!allFields.find((field) => field?.enable_multilanguage === true);
  }, [selectedTab]);

  const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

  const params = {
    language_setting: i18n?.language,
  };

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
        params
      );
    },
    {
      select: ({data}) => {
        return {
          fieldsMap: listToMap(data?.fields),
        };
      },
      enabled: !!relatedTableSlug,
    }
  );
  console.log("relations", relations);
  return (
    <>
      {selectedManyToManyRelation && (
        <ManyToManyRelationCreateModal
          relation={selectedManyToManyRelation}
          closeModal={() => setSelectedManyToManyRelation(null)}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      {data ? (
        <Card className={styles.card}>
          <Tabs
            className={"react_detail"}
            selectedIndex={selectedTabIndex}
            onSelect={(index) => {
              setSelectedTabIndex(index);
            }}
          >
            {!data?.is_visible_section && (
              <div className={styles.cardHeader}>
                <TabList className={styles.tabList}>
                  {data?.tabs?.map((el, index) => (
                    <Tab
                      key={el.id}
                      className={`${styles.tabs_item} ${
                        selectedTabIndex === index
                          ? "custom-selected-tab"
                          : "custom-tab"
                      }`}
                      onClick={() => {
                        setSelectedIndex(index);
                        onSelect(el);
                      }}
                    >
                      {data?.view_relation_type === "FILE" && (
                        <>
                          <InsertDriveFile /> Файлы
                        </>
                      )}
                      <div className="flex align-center gap-2 text-nowrap">
                        {el?.attributes?.[`label_${i18n.language}`]
                          ? el?.attributes?.[`label_${i18n.language}`]
                          : el?.relation?.attributes?.[`label_${i18n.language}`]
                          ? el?.relation?.attributes?.[`label_${i18n.language}`]
                          : el?.label ?? el?.title}
                      </div>
                    </Tab>
                  ))}
                </TabList>

                <div className="flex gap-2">
                  <CustomActionsButton
                    tableSlug={selectedRelation?.relatedTable}
                    selectedObjects={selectedObjects}
                    setSelectedObjects={setSelectedObjects}
                  />

                  {data[selectedTabIndex]?.multiple_insert && (
                    <MultipleInsertButton
                      view={filteredRelations[selectedTabIndex]}
                      tableSlug={
                        filteredRelations[selectedTabIndex].relatedTable
                      }
                    />
                  )}

                  {getRelatedTabeSlug && (
                    <>
                      <FixColumnsRelationSection
                        relatedTable={getRelatedTabeSlug}
                        fieldsMap={fieldsMap}
                        getAllData={getAllData}
                      />
                      <Divider orientation="vertical" flexItem />
                      <VisibleColumnsButtonRelationSection
                        currentView={getRelatedTabeSlug}
                        fieldsMap={fieldsMap}
                        getAllData={getAllData}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {loader ? (
              <PageFallback />
            ) : (
              data?.tabs?.map((el, index) => (
                <TabPanel key={el.id}>
                  {!selectedTab?.relation_id ? (
                    <NewMainInfo
                      control={control}
                      loader={loader}
                      isMultiLanguage={isMultiLanguage}
                      computedSections={computedSections}
                      setFormValue={setFormValue}
                      relatedTable={relatedTable}
                      relation={data}
                      selectedIndex={selectedIndex}
                      errors={errors}
                    />
                  ) : data?.relatedTable === "file" ? (
                    <FilesSection
                      setFormValue={setFormValue}
                      remove={remove}
                      reset={reset}
                      watch={watch}
                      control={control}
                      formVisible={formVisible}
                      relation={data}
                      createFormVisible={relationsCreateFormVisible}
                      setCreateFormVisible={setCreateFormVisible}
                    />
                  ) : (
                    <RelationTable
                      ref={myRef}
                      loader={loader}
                      remove={remove}
                      reset={reset}
                      selectedTabIndex={selectedTabIndex}
                      watch={watch}
                      selectedTab={selectedTab}
                      control={control}
                      getValues={getValues}
                      setFormValue={setFormValue}
                      fields={fields}
                      setFormVisible={setFormVisible}
                      formVisible={formVisible}
                      key={selectedTab.id}
                      relation={relations}
                      createFormVisible={relationsCreateFormVisible}
                      setCreateFormVisible={setCreateFormVisible}
                      selectedObjects={selectedObjects}
                      setSelectedObjects={setSelectedObjects}
                      tableSlug={tableSlug}
                      id={id}
                      type={type}
                      fieldsMap={fieldsMap}
                      relatedTable={relatedTable}
                    />
                  )}
                </TabPanel>
              ))
            )}
          </Tabs>
        </Card>
      ) : null}
    </>
  );
};

export default NewRelationSection;
