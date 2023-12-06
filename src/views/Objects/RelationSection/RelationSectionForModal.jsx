import { tableSizeAction } from "@/store/tableSize/tableSizeSlice";
import { InsertDriveFile } from "@mui/icons-material";
import { Box, Card, Divider } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import PageFallback from "../../../components/PageFallback";
import constructorObjectService from "../../../services/constructorObjectService";
import layoutService from "../../../services/layoutService";
import { store } from "../../../store";
import FilesSection from "../FilesSection";
import MainInfoForModal from "../MainInfoForModal";
import ManyToManyRelationCreateModal from "./ManyToManyRelationCreateModal";
import RelationTable from "./RelationTable";
import styles from "./style.module.scss";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import FixColumnsRelationSection from "./FixColumnsRelationSection";
import VisibleColumnsButtonRelationSection from "./VisibleColumnsButtonRelationSection";
import constructorTableService from "../../../services/constructorTableService";
import { listToMap } from "../../../utils/listToMap";

const RelationSectionForModal = ({
  selectedTabIndex,
  setSelectedTabIndex,
  relations,
  loader,
  tableSlug: tableSlugFromProps,
  id: idFromProps,
  limit,
  setLimit,
  relatedTable,
  control,
  handleSubmit,
  reset,
  setFormValue,
  watch,
  setSelectTab,
  selectedTab,
  errors,
  getAllData,
}) => {
  const { i18n } = useTranslation();
  const [shouldGet, setShouldGet] = useState(false);
  const [fieldSlug, setFieldSlug] = useState("");
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [jwtObjects, setJwtObjects] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [heightControl, setHeightControl] = useState(false);
  const [moreShowButton, setMoreShowButton] = useState(false);
  const [defaultValuesFromJwt, setDefaultValuesFromJwt] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [type, setType] = useState(null);
  const [data, setData] = useState([]);
  const [editAcces, setEditAccess] = useState(false);

  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  let [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const queryTab = searchParams.get("tab");
  const myRef = useRef();
  const tables = useSelector((state) => state?.auth?.tables);

  const { tableSlug: tableSlugFromParams, id: idFromParams } = useParams();
  const tableSlug = tableSlugFromProps ?? tableSlugFromParams;
  const id = idFromProps ?? idFromParams;
  const menuItem = store.getState().menu.menuItem;
  const [selectedManyToManyRelation, setSelectedManyToManyRelation] = useState(null);
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState({});

  const tableHeightOptions = [
    {
      label: "Small",
      value: "small",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "Large",
      value: "large",
    },
  ];

  const filteredRelations = useMemo(() => {
    const rel = data?.filter((relation) => relation?.table_id);
    return rel?.filter((item) => {
      return item?.type;
    });
  }, [data]);

  const selectedRelation = filteredRelations?.[selectedTabIndex];

  const getRelatedTabeSlug = useMemo(() => {
    return relations?.find((el) => el?.id === selectedTab?.relation_id);
  }, [relations, selectedTab]);

  const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: "multi",
  });

  const setCreateFormVisible = (relationId, value) => {
    setRelationsCreateFormVisible((prev) => ({
      ...prev,
      [relationId]: value,
    }));
  };
  const navigateToCreatePage = () => {
    let mapped = {
      [`${tableSlug}_id`]: idFromParams ?? "",
    };
    defaultValuesFromJwt.forEach((el) => {
      let keys = Object.keys(el);
      let values = Object.values(el);
      mapped[keys[0]] = values[0];
    });

    if (getRelatedTabeSlug?.type === "Many2Many") setSelectedManyToManyRelation(getRelatedTabeSlug);
    else {
      append(mapped);
      setFormVisible(true);
    }
  };

  const getValue = useCallback((item, key) => {
    return typeof !item?.[key] === "object" ? item?.[key].value : item?.[key];
  }, []);

  const relationFieldSlug = useMemo(() => {
    return relations.find((item) => item?.type === "Many2Dynamic");
  }, [relations]);

  const { mutate: updateMultipleObject } = useMutation(
    (values) =>
      constructorObjectService.updateMultipleObject(getRelatedTabeSlug.relatedTable, {
        data: {
          objects: values.multi.map((item) => ({
            ...item,
            guid: item?.guid ?? undefined,
            doctors_id_2: getValue(item, "doctors_id_2"),
            doctors_id_3: getValue(item, "doctors_id_3"),
            specialities_id: getValue(item, "specialities_id"),
            [fieldSlug]: id,
          })),
        },
      }),
    {
      enabled: !getRelatedTabeSlug?.relatedTable,
      onSuccess: () => {
        setShouldGet((p) => !p);
        setFormVisible(false);
      },
    }
  );
  const onSubmit = (data) => {
    updateMultipleObject(data);
  };

  const computedSections = useMemo(() => {
    const sections = [];
    data?.map((relation) => {
      return relation?.tabs?.[selectedTabIndex]?.sections?.map((el) => {
        return !sections?.[el] && sections.push(el);
      });
    });
    return sections;
  }, [data, selectedTabIndex]);

  /*****************************JWT START*************************/

  useEffect(() => {
    getRelatedTabeSlug &&
      constructorObjectService
        .getList(
          getRelatedTabeSlug?.relatedTable,
          {
            data: {
              offset: 0,
              limit: 0,
              [`${relationFieldSlug?.relation_field_slug}.${tableSlug}_id`]: idFromParams,
            },
          },
          {
            language_setting: i18n?.language,
          }
        )
        .then((res) => {
          setJwtObjects(res?.data?.fields?.filter((item) => item?.attributes?.object_id_from_jwt === true));
        })
        .catch((a) => console.log("error", a));
  }, [getRelatedTabeSlug, idFromParams, relationFieldSlug, tableSlug]);

  const refetchData = async () => {
    getRelatedTabeSlug &&
      constructorObjectService
        .getList(
          getRelatedTabeSlug?.relatedTable,
          {
            data: {
              offset: 0,
              limit: 0,
              [`${relationFieldSlug?.relation_field_slug}.${tableSlug}_id`]: idFromParams,
            },
          },
          {
            language_setting: i18n?.language,
          }
        )
        .then((res) => {
          setJwtObjects(res?.data?.fields?.filter((item) => item?.attributes?.object_id_from_jwt === true));
        })
        .catch((a) => console.log("error", a));
  };

  useEffect(() => {
    let tableSlugsFromObj = jwtObjects?.map((item) => {
      return item?.table_slug;
    });

    let computeJwtObjs = tableSlugsFromObj?.map((item) => {
      return tables?.filter((table) => item === table?.table_slug);
    });

    setDefaultValuesFromJwt(
      computeJwtObjs?.map((item) => {
        return {
          [`${item?.[0]?.table_slug}_id`]: item?.[0]?.object_id,
        };
      })
    );
  }, [jwtObjects, tables]);

  const onSelect = (el) => {
    setType(el?.type);
    setSelectTab(el ?? relations[selectedTabIndex]);
  };

  /*****************************JWT END*************************/

  useEffect(() => {
    layoutService
      .getList({
        "table-slug": tableSlug,
        language_setting: i18n?.language,
      })
      .then((res) => {
        console.log("eeeeeeeee", res?.layouts);
        const layout = res?.layouts
          ?.filter((layout) => layout?.is_default === true)
          .map((item) => {
            return {
              ...item,
              tabs: item?.tabs?.filter((tab) => tab?.relation?.permission?.view_permission === true || tab?.type === "section"),
            };
          })
          ?.map((layout) => {
            return {
              ...layout,
              tabs: layout?.tabs?.map((tab) => {
                return {
                  ...tab,
                  sections: tab?.sections?.map((section) => {
                    return {
                      ...section,
                      fields: section?.fields?.map((field) => {
                        if (field?.is_visible_layout === undefined) {
                          return {
                            ...field,
                            is_visible_layout: true,
                          };
                        } else {
                          return field;
                        }
                      }),
                    };
                  }),
                };
              }),
            };
          });
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

  useEffect(() => {
    if (data?.[0]?.tabs?.length > 0) {
      setSelectTab(data?.[0]?.tabs?.[0]);
    }
  }, [data, setSelectTab]);

  useEffect(() => {
    queryTab ? setSelectedTabIndex(parseInt(queryTab) - 1) : setSelectedTabIndex(0);
  }, [queryTab, setSelectedTabIndex]);

  const handleHeightControl = (val) => {
    dispatch(
      tableSizeAction.setTableHeight({
        tableHeight: val,
      })
    );
    setHeightControl(false);
  };

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    setSelectedObjects([]);
    setFormVisible(false);
  }, [selectedTabIndex]);

  const params = {
    language_setting: i18n?.language,
  };

  useEffect(() => {
    const result = {};

    filteredRelations?.forEach((relation) => (result[relation.id] = false));

    setRelationsCreateFormVisible(result);
  }, [filteredRelations]);

  const {
    data: { fieldsMap } = {
      views: [],
      fieldsMap: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    refetch: refetchFields,
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
      select: ({ data }) => {
        return {
          fieldsMap: listToMap(data?.fields),
        };
      },
      enabled: !!relatedTableSlug,
    }
  );
  const queryClient = useQueryClient();

  return (
    <>
      {selectedManyToManyRelation && (
        <ManyToManyRelationCreateModal relation={selectedManyToManyRelation} closeModal={() => setSelectedManyToManyRelation(null)} limit={limit} setLimit={setLimit} />
      )}
      {data?.length ? (
        <Card className={styles.card}>
          {data?.map((relation) => (
            <Tabs
              key={relation.id}
              className={"react_detail"}
              selectedIndex={selectedTabIndex}
              style={{
                height: "100%",
              }}
              onSelect={(index) => {
                setSelectedTabIndex(index);
              }}
            >
              {!relation?.is_visible_section && (
                <div className={styles.cardHeaderModal}>
                  <TabList className={styles.tabList}>
                    {relation?.tabs?.map((el, index) => (
                      <Tab
                        key={el.id}
                        className={`${styles.tabs_item} ${selectedTabIndex === index ? "custom-selected-tab" : "custom-tab"}`}
                        onClick={() => {
                          setSelectedIndex(index);
                          onSelect(el);
                        }}
                      >
                        {relation?.view_relation_type === "FILE" && (
                          <>
                            <InsertDriveFile /> Файлы
                          </>
                        )}
                        <div className="flex align-center gap-2 text-nowrap">
                          {el?.attributes?.[`label_${i18n.language}`]
                            ? el?.attributes?.[`label_${i18n.language}`]
                            : el?.relation?.attributes?.[`title_${i18n.language}`]
                            ? el?.relation?.attributes?.[`title_${i18n.language}`]
                            : el?.label ?? el?.title}
                        </div>
                      </Tab>
                    ))}
                  </TabList>
                  {!getRelatedTabeSlug &&
                    (editAcces ? (
                      <>
                        <SecondaryButton
                          onClick={() => setEditAccess((prev) => !prev)}
                          color=""
                          style={{
                            right: "16px",
                            border: "0px solid #2d6ce5",
                            padding: "4px",
                          }}
                        >
                          <CloseIcon
                            style={{
                              color: "red",
                              width: "20px",
                              height: "20px",
                            }}
                          />
                        </SecondaryButton>
                      </>
                    ) : (
                      <SecondaryButton
                        onClick={() => setEditAccess((prev) => !prev)}
                        color=""
                        style={{
                          right: "16px",
                          border: "0px solid #2d6ce5",
                          padding: "4px",
                        }}
                      >
                        <EditIcon
                          style={{
                            color: "#2d6ce5",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      </SecondaryButton>
                    ))}

                  {getRelatedTabeSlug && (
                    <>
                      <FixColumnsRelationSection relatedTable={getRelatedTabeSlug} fieldsMap={fieldsMap} getAllData={getAllData} />
                      <Divider orientation="vertical" flexItem />
                      <VisibleColumnsButtonRelationSection currentView={getRelatedTabeSlug} fieldsMap={fieldsMap} getAllData={getAllData} />
                    </>
                  )}
                </div>
              )}

              <Box
                sx={{
                  height: "100%",
                }}
              >
                {loader ? (
                  <PageFallback />
                ) : (
                  relation?.tabs?.map((el, index) => (
                    <TabPanel
                      key={el.id}
                      style={{
                        height: "100%",
                      }}
                    >
                      {!selectedTab?.relation_id ? (
                        <MainInfoForModal
                          control={control}
                          loader={loader}
                          isMultiLanguage={isMultiLanguage}
                          computedSections={computedSections}
                          setFormValue={setFormValue}
                          relatedTable={relatedTable}
                          relation={relation}
                          selectedIndex={selectedIndex}
                          errors={errors}
                          remove={remove}
                          editAcces={editAcces}
                          setData={setData}
                          data={data}
                        />
                      ) : relation?.relatedTable === "file" ? (
                        <FilesSection
                          shouldGet={shouldGet}
                          setFormValue={setFormValue}
                          remove={remove}
                          reset={reset}
                          watch={watch}
                          control={control}
                          formVisible={formVisible}
                          relation={relation}
                          key={relation.id}
                          createFormVisible={relationsCreateFormVisible}
                          setCreateFormVisible={setCreateFormVisible}
                        />
                      ) : (
                        <RelationTable
                          ref={myRef}
                          loader={loader}
                          setFieldSlug={setFieldSlug}
                          setDataLength={setDataLength}
                          shouldGet={shouldGet}
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
                          createFormVisible={relationsCreateFormVisible}
                          setCreateFormVisible={setCreateFormVisible}
                          selectedObjects={selectedObjects}
                          setSelectedObjects={setSelectedObjects}
                          tableSlug={tableSlug}
                          id={id}
                          type={type}
                        />
                      )}
                    </TabPanel>
                  ))
                )}
              </Box>
            </Tabs>
          ))}
        </Card>
      ) : null}
    </>
  );
};

export default RelationSectionForModal;
