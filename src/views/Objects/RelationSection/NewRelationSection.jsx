import {CheckIcon} from "@/assets/icons/icon";
import {tableSizeAction} from "@/store/tableSize/tableSizeSlice";
import ExcelDownloadButton from "@/views/Objects/components/ExcelButtons/ExcelDownloadButton";
import ExcelUploadButton from "@/views/Objects/components/ExcelButtons/ExcelUploadButton";
import MultipleInsertButton from "@/views/Objects/components/MultipleInsertForm";
import style from "@/views/Objects/style.module.scss";
import {Add, Clear, Edit, InsertDriveFile, Save} from "@mui/icons-material";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {Card} from "@mui/material";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useFieldArray} from "react-hook-form";
import {useMutation} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useParams, useSearchParams} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import PageFallback from "../../../components/PageFallback";
import constructorObjectService from "../../../services/constructorObjectService";
import layoutService from "../../../services/layoutService";
import {store} from "../../../store";
import FilesSection from "../FilesSection";
import NewMainInfo from "../NewMainInfo";
import CustomActionsButton from "../components/CustomActionsButton";
import DocumentGeneratorButton from "../components/DocumentGeneratorButton";
import ManyToManyRelationCreateModal from "./ManyToManyRelationCreateModal";
import RelationTable from "./RelationTable";
import styles from "./style.module.scss";
import {useTranslation} from "react-i18next";

const NewRelationSection = ({
  selectedTabIndex,
  setSelectedTabIndex,
  relations,
  loader,
  tableSlug: tableSlugFromProps,
  id: idFromProps,
  limit,
  setLimit,
  // computedSections,
  relatedTable,
  control,
  handleSubmit,
  reset,
  setFormValue,
  watch,
  setSelectTab,
  selectedTab,
  errors,
}) => {
  const [data, setData] = useState([]);

  const filteredRelations = useMemo(() => {
    const rel = data?.filter((relation) => relation?.table_id);
    return rel?.filter((item) => {
      return item?.type;
    });
  }, [data]);

  const {tableSlug: tableSlugFromParams, id: idFromParams} = useParams();
  const tableSlug = tableSlugFromProps ?? tableSlugFromParams;
  const id = idFromProps ?? idFromParams;
  const menuItem = store.getState().menu.menuItem;
  const [selectedManyToManyRelation, setSelectedManyToManyRelation] =
    useState(null);
  const [relationsCreateFormVisible, setRelationsCreateFormVisible] = useState(
    {}
  );
  const {i18n} = useTranslation();
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

  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  let [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const queryTab = searchParams.get("tab");
  const myRef = useRef();
  const tables = useSelector((state) => state?.auth?.tables);

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

  const handleHeightControl = (val) => {
    dispatch(
      tableSizeAction.setTableHeight({
        tableHeight: val,
      })
    );
    setHeightControl(false);
  };

  // const {
  //   control,
  //   reset,
  //   handleSubmit,
  //   watch,
  //   setValue: setFormValue,
  // } = useForm({
  //   defaultValues: {
  //     [`${tableSlug}_id`]: id,
  //     multi: [],
  //   },
  // });

  const {fields, remove, append, update} = useFieldArray({
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
    const result = {};

    filteredRelations?.forEach((relation) => (result[relation.id] = false));

    setRelationsCreateFormVisible(result);
  }, [filteredRelations]);

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
    // const relation = filteredRelations[selectedTabIndex];
    if (getRelatedTabeSlug?.type === "Many2Many")
      setSelectedManyToManyRelation(getRelatedTabeSlug);
    else {
      append(mapped);
      setFormVisible(true);
    }
  };

  const getValue = useCallback((item, key) => {
    return typeof !item?.[key] === "object" ? item?.[key].value : item?.[key];
  }, []);

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

  const relationFieldSlug = useMemo(() => {
    return relations.find((item) => item?.type === "Many2Dynamic");
  }, [relations]);

  const {mutate: updateMultipleObject} = useMutation(
    (values) =>
      constructorObjectService.updateMultipleObject(
        getRelatedTabeSlug.relatedTable,
        {
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
        }
      ),
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
    // navigate("/reloadRelations", {
    //   state: {
    //     redirectUrl: window.location.pathname,
    //   },
    // });
  };

  /*****************************JWT START*************************/

  const computedSections = useMemo(() => {
    const sections = [];
    data?.map((relation) => {
      return relation?.tabs?.[selectedTabIndex]?.sections?.map((el) => {
        return !sections?.[el] && sections.push(el);
      });
    });
    return sections;
  }, [data, selectedTabIndex]);

  useEffect(() => {
    getRelatedTabeSlug &&
      constructorObjectService
        .getList(getRelatedTabeSlug?.relatedTable, {
          data: {
            offset: 0,
            limit: 0,
            [`${relationFieldSlug?.relation_field_slug}.${tableSlug}_id`]:
              idFromParams,
          },
        })
        .then((res) => {
          setJwtObjects(
            res?.data?.fields?.filter(
              (item) => item?.attributes?.object_id_from_jwt === true
            )
          );
        })
        .catch((a) => console.log("error", a));
  }, [, getRelatedTabeSlug, idFromParams, relationFieldSlug, tableSlug]);

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
    // if (!menuItem.table_id) return;
    layoutService
      .getList({
        "table-slug": tableSlug,
        language_setting: i18n?.language,
      })
      .then((res) => {
        const layout = res?.layouts
          ?.filter((layout) => layout?.is_default === true)
          .map((item) => {
            return {
              ...item,
              tabs: item?.tabs?.filter(
                (tab) =>
                  tab?.relation?.permission?.view_permission === true ||
                  tab?.type === "section"
              ),
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

  const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

  // if (!data?.length) return <PageFallback />;
  // if (loader) return <PageFallback />;
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
      {data?.length ? (
        <Card className={styles.card}>
          {data?.map((relation) => (
            <Tabs
              key={relation.id}
              className={"react_detail"}
              selectedIndex={selectedTabIndex}
              onSelect={(index) => {
                setSelectedTabIndex(index);
              }}
            >
              {!relation?.is_visible_section && (
                <div className={styles.cardHeader}>
                  <TabList className={styles.tabList}>
                    {relation?.tabs?.map((el, index) => (
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
                        {relation?.view_relation_type === "FILE" && (
                          <>
                            <InsertDriveFile /> Файлы
                          </>
                        )}
                        <div className="flex align-center gap-2 text-nowrap">
                          {el?.attributes?.[`label_${i18n.language}`]
                            ? el?.attributes?.[`label_${i18n.language}`]
                            : el?.relation?.attributes?.[
                                `title_${i18n.language}`
                              ]
                            ? el?.relation?.attributes?.[
                                `title_${i18n.language}`
                              ]
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
                    <RectangleIconButton
                      color="success"
                      size="small"
                      onClick={navigateToCreatePage}
                      disabled={!id}
                    >
                      <Add style={{color: "#007AFF"}} />
                    </RectangleIconButton>

                    {formVisible ? (
                      <>
                        <RectangleIconButton
                          color="success"
                          size="small"
                          onClick={handleSubmit(onSubmit)}
                          // loader={loader}
                        >
                          <Save color="success" />
                        </RectangleIconButton>
                        <RectangleIconButton
                          color="error"
                          type="edit"
                          onClick={() => {
                            setFormVisible(false);
                            if (fields.length > dataLength) {
                              remove(
                                Array(fields.length - dataLength)
                                  .fill("*")
                                  .map(
                                    (i, index) => fields.length - (index + 1)
                                  )
                              );
                            }
                          }}
                        >
                          <Clear color="error" />
                        </RectangleIconButton>
                      </>
                    ) : (
                      fields.length > 0 && (
                        <RectangleIconButton
                          color="success"
                          size="small"
                          onClick={() => {
                            setFormVisible(true);
                          }}
                        >
                          <Edit color="primary" />
                        </RectangleIconButton>
                      )
                    )}

                    <DocumentGeneratorButton />

                    {data[selectedTabIndex]?.multiple_insert && (
                      <MultipleInsertButton
                        view={filteredRelations[selectedTabIndex]}
                        tableSlug={
                          filteredRelations[selectedTabIndex].relatedTable
                        }
                      />
                    )}

                    <RectangleIconButton
                      color="white"
                      onClick={() => setHeightControl(!heightControl)}
                    >
                      <div style={{position: "relative"}}>
                        <span
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FormatLineSpacingIcon color="primary" />
                        </span>
                        {heightControl && (
                          <div className={style.heightControl}>
                            {tableHeightOptions.map((el) => (
                              <div
                                key={el.value}
                                className={style.heightControl_item}
                                onClick={() => handleHeightControl(el.value)}
                              >
                                {el.label}
                                {tableHeight === el.value ? (
                                  <CheckIcon color="primary" />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </RectangleIconButton>

                    <RectangleIconButton
                      color="success"
                      size="small"
                      onClick={() => setMoreShowButton(!moreShowButton)}
                    >
                      <div style={{position: "relative"}}>
                        <span
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <MoreVertIcon color="primary" />
                        </span>
                        {moreShowButton && (
                          <div
                            className={style.heightControl}
                            style={{minWidth: "auto"}}
                          >
                            <div
                              className={style.heightControl_item}
                              style={{
                                justifyContent: "flex-start",
                                color: "#6E8BB7",
                                padding: "5px",
                              }}
                            >
                              <ExcelUploadButton withText={true} />
                            </div>

                            <div
                              className={style.heightControl_item}
                              style={{
                                justifyContent: "flex-start",
                                color: "#6E8BB7",
                                padding: "5px",
                              }}
                            >
                              <ExcelDownloadButton
                                relatedTable={relatedTableSlug}
                                fieldSlug={
                                  selectedTab?.type === "section"
                                    ? relatedTableSlug
                                    : fieldSlug
                                }
                                fieldSlugId={id}
                                withText={true}
                                sort={myRef.current?.excelSort()}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </RectangleIconButton>
                  </div>
                </div>
              )}

              {loader ? (
                <PageFallback />
              ) : (
                relation?.tabs?.map((el, index) => (
                  <TabPanel key={el.id}>
                    {!selectedTab?.relation_id ? (
                      <NewMainInfo
                        control={control}
                        loader={loader}
                        isMultiLanguage={isMultiLanguage}
                        computedSections={computedSections}
                        setFormValue={setFormValue}
                        relatedTable={relatedTable}
                        relation={relation}
                        selectedIndex={selectedIndex}
                        errors={errors}
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
            </Tabs>
          ))}
        </Card>
      ) : null}
    </>
  );
};

export default NewRelationSection;
