import { Drawer } from "@mui/material";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import ObjectDataTable from "../../../components/DataTable/ObjectDataTable";
import FRow from "../../../components/FormElements/FRow";
import PageFallback from "../../../components/PageFallback";
import useTabRouter from "../../../hooks/useTabRouter";
import useCustomActionsQuery from "../../../queries/hooks/useCustomActionsQuery";
import constructorFieldService from "../../../services/constructorFieldService";
import constructorObjectService from "../../../services/constructorObjectService";
import constructorRelationService from "../../../services/constructorRelationService";
import { generateGUID } from "../../../utils/generateID";
import { listToMap } from "../../../utils/listToMap";
import { objectToArray } from "../../../utils/objectToArray";
import { pageToOffset } from "../../../utils/pageToOffset";
import FieldSettings from "../../Constructor/Tables/Form/Fields/FieldSettings";
import { Filter } from "../components/FilterGenerator";
import styles from "./style.module.scss";

const RelationTable = forwardRef(
  (
    {
      getValues,
      relation,
      shouldGet,
      createFormVisible,
      remove,
      setCreateFormVisible,
      watch,
      loader,
      selectedObjects,
      setSelectedObjects,
      setFieldSlug,
      id,
      reset,
      selectedTabIndex,
      control,
      setFormValue,
      fields,
      setFormVisible,
      formVisible,
      selectedTab,
      type,
      relatedTable = {},
      getAllData = () => {},
    },
    ref
  ) => {
    const {appId, tableSlug} = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {navigateToForm} = useTabRouter();
    const tableRef = useRef(null);
    const [filters, setFilters] = useState({});
    const [drawerState, setDrawerState] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const {i18n} = useTranslation();
    const [relOptions, setRelOptions] = useState([]);

    const paginationInfo = useSelector(
      (state) => state?.pagination?.paginationInfo
    );

    const filterChangeHandler = (value, name) => {
      setFilters({
        ...filters,
        [name]: value ?? undefined,
      });
    };

    const mainForm = useForm({
      defaultValues: {
        show_in_menu: true,
        fields: [],
        app_id: appId,
        summary_section: {
          id: generateGUID(),
          label: "Summary",
          fields: [],
          icon: "",
          order: 1,
          column: "SINGLE",
          is_summary_section: true,
        },
        // view_relations: [],
        label: "",
        description: "",
        slug: "",
        icon: "",
      },
      mode: "all",
    });

    const paginiation = useMemo(() => {
      const getObject = paginationInfo.find(
        (el) => el?.tableSlug === tableSlug
      );

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

    const getRelationFields = async () => {
      return new Promise(async (resolve) => {
        const getFieldsData = constructorFieldService.getList({table_id: id});

        const getRelations = constructorRelationService.getList({
          table_slug: tableSlug,
          relation_table_slug: tableSlug,
        });
        const [{relations = []}, {fields = []}] = await Promise.all([
          getRelations,
          getFieldsData,
        ]);
        mainForm.setValue("fields", fields);
        const relationsWithRelatedTableSlug = relations?.map((relation) => ({
          ...relation,
          relatedTableSlug:
            relation.table_to?.slug === tableSlug ? "table_from" : "table_to",
        }));

        const layoutRelations = [];
        const tableRelations = [];

        relationsWithRelatedTableSlug?.forEach((relation) => {
          if (
            (relation.type === "Many2One" &&
              relation.table_from?.slug === tableSlug) ||
            (relation.type === "One2Many" &&
              relation.table_to?.slug === tableSlug) ||
            relation.type === "Recursive" ||
            (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
            (relation.type === "Many2Dynamic" &&
              relation.table_from?.slug === tableSlug)
          ) {
            layoutRelations.push(relation);
          } else {
            tableRelations.push(relation);
          }
        });

        const layoutRelationsFields = layoutRelations.map((relation) => ({
          ...relation,
          id: `${relation[relation.relatedTableSlug]?.slug}#${relation.id}`,
          attributes: {
            fields: relation.view_fields ?? [],
          },
          label:
            relation?.label ?? relation[relation.relatedTableSlug]?.label
              ? relation[relation.relatedTableSlug]?.label
              : relation?.title,
        }));

        mainForm.setValue("relations", relations);
        mainForm.setValue("relationsMap", listToMap(relations));
        mainForm.setValue("layoutRelations", layoutRelationsFields);
        mainForm.setValue("tableRelations", tableRelations);
        resolve();
      });
    };

    const getRelatedTabeSlug = useMemo(() => {
      return relation?.find((el) => el?.id === selectedTab?.relation_id);
    }, [relation, selectedTab?.relation_id]);

    useEffect(() => {
      if (getRelatedTabeSlug?.default_editable) {
        setFormVisible(true);
      }
    }, [getRelatedTabeSlug?.default_editable, setFormVisible]);

    const onCheckboxChange = (val, row) => {
      if (val) setSelectedObjects((prev) => [...prev, row.guid]);
      else setSelectedObjects((prev) => prev.filter((id) => id !== row.guid));
    };
    const onChecked = (id) => {
      setSelectedObjects((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        } else {
          return [...prev, id];
        }
      });
    };

    const computedFilters = useMemo(() => {
      const relationFilter = {};

      if (getRelatedTabeSlug?.type === "Many2Many")
        relationFilter[`${tableSlug}_ids`] = id;
      else if (getRelatedTabeSlug?.type === "Many2Dynamic")
        relationFilter[
          `${getRelatedTabeSlug?.relation_field_slug}.${tableSlug}_id`
        ] = id;
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

    //============VIEW PERMISSION=========
    const viewPermission = useMemo(() => {
      if (getRelatedTabeSlug?.permission?.view_permission) return true;
      else return false;
    }, [getRelatedTabeSlug?.permission?.view_permission]);

    const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

    function customSortArray(a, b) {
      const commonItems = a?.filter((item) => b.includes(item));
      commonItems?.sort();
      const remainingItems = a?.filter((item) => !b.includes(item));
      const sortedArray = commonItems?.concat(remainingItems);
      return sortedArray;
    }

    const {
      data: {
        tableData = [],
        pageCount = 1,
        columns = [],
        quickFilters = [],
        fieldsMap = {},
      } = {},
      refetch,
      isLoading: dataFetchingLoading,
    } = useQuery(
      [
        "GET_OBJECT_LIST",
        relatedTableSlug,
        shouldGet,
        {
          filters: computedFilters,
          offset: pageToOffset(currentPage, limit),
          limit,
        },
      ],
      () => {
        return constructorObjectService.getList(
          relatedTableSlug,
          {
            data: {
              offset: pageToOffset(currentPage, limit),
              limit: limitPage !== 0 ? limitPage : limit,
              from_tab: type === "relation" ? true : false,
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
          const tableData = id ? objectToArray(data.response ?? {}) : [];
          const pageCount = isNaN(data?.count) || tableData.length === 0 ? 1 : Math.ceil(data.count / paginiation);

          const fieldsMap = listToMap(data.fields);

          setFieldSlug(
            Object.values(fieldsMap).find((i) => i.table_slug === tableSlug)
              ?.slug
          );

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
            getRelatedTabeSlug?.columns,
            array.map((el) => el.id)
          )
            ?.map((el) => fieldsMap[el])
            ?.filter((el) => el);

          const quickFilters = getRelatedTabeSlug.quick_filters?.map(({ field_id }) => fieldsMap[field_id])?.filter((el) => el);

          return {
            tableData,
            pageCount,
            columns,
            quickFilters,
            fieldsMap,
          };
        },
        onSuccess: () => {
          setFormValue("multi", tableData);
        },
      }
    );

    const computedRelationFields = useMemo(() => {
      return Object.values(fieldsMap)?.filter((element) => {
        return element?.type === "LOOKUP" || element?.type === "LOOKUPS";
      });
    }, [fieldsMap]);

    const getOptionsList = () => {
      const computedIds = computedRelationFields?.map((item) => ({
        table_slug: item?.slug,
        ids:
          item?.type === "LOOKUP"
            ? Array.from(new Set(tableData?.map((obj) => obj?.[item?.slug])))
            : Array.from(
                new Set(
                  [].concat(...tableData?.map((obj) => obj?.[item?.slug]))
                )
              ),
      }));
      tableData?.length &&
        computedRelationFields?.forEach((item, index) => {
          constructorObjectService
            .getListV2(item?.table_slug, {
              data: {
                limit: 10,
                offset: 0,
                additional_request: {
                  additional_field: "guid",
                  additional_values: computedIds?.find(
                    (computedItem) => computedItem?.table_slug === item?.slug
                  )?.ids,
                },
              },
            })
            .then((res) => {
              if (relOptions?.length > 0) {
                setRelOptions((prev) => {
                  const updatedOptions = prev.map((option) => {
                    if (option.table_slug === item?.table_slug) {
                      return {
                        table_slug: item?.table_slug,
                        response: res?.data?.response,
                      };
                    }
                    return option;
                  });
                  return updatedOptions;
                });
              } else {
                setRelOptions((prev) => [
                  ...prev,
                  {
                    table_slug: item?.table_slug,
                    response: res?.data?.response,
                  },
                ]);
              }
            });
        });
    };

    useEffect(() => {
      getOptionsList();
    }, [tableData, computedRelationFields]);

    useEffect(() => {
      if (isNaN(parseInt(getRelatedTabeSlug?.default_limit))) setLimit(10);
      else setLimit(parseInt(getRelatedTabeSlug?.default_limit));
    }, [getRelatedTabeSlug?.default_limit]);

    useEffect(() => {
      setFormValue("multi", tableData);
    }, [selectedTab, tableData]);

    const {isLoading: deleteLoading, mutate: deleteHandler} = useMutation(
      (row) => {
        if (getRelatedTabeSlug.type === "Many2Many") {
          const data = {
            id_from: id,
            id_to: [row.guid],
            table_from: tableSlug,
            table_to: relatedTableSlug,
          };

          return constructorObjectService.deleteManyToMany(data);
        } else {
          return constructorObjectService.delete(relatedTableSlug, row.guid);
        }
      },
      {
        onSuccess: (a, b) => {
          remove(tableData.findIndex((i) => i.guid === b.guid));
          queryClient.refetchQueries(["GET_OBJECT_LIST"]);
        },
      }
    );

    const {data: {custom_events: customEvents = []} = {}} =
      useCustomActionsQuery({
        tableSlug: relatedTableSlug,
      });

    const navigateToEditPage = (row) => {
      navigateToForm(relatedTableSlug, "EDIT", row);
    };

    const navigateToTablePage = () => {
      navigate(`/main/${appId}/object/${relatedTableSlug}`, {
        state: {
          [`${tableSlug}_${
            getRelatedTabeSlug.type === "Many2Many" ? "ids" : "id"
          }`]: id,
        },
      });
    };
    const [selectedObjectsForDelete, setSelectedObjectsForDelete] = useState([]);

    const multipleDelete = async () => {
      try {
        await constructorObjectService.deleteMultiple(tableSlug, {
          ids: selectedObjectsForDelete.map((i) => i.guid),
        });
        queryClient.refetchQueries("GET_OBJECTS_LIST", {tableSlug});
      } finally {
        
      }
    };

    if (loader) return <PageFallback />;
    return (
      <div assName={styles.relationTable} ref={tableRef}>
        {!!quickFilters?.length && (
          <div className={styles.filtersBlock}>
            {quickFilters.map((field) => (
              <FRow key={field.id}>
                {/* label={field.label} */}
                <Filter
                  field={field}
                  name={field.slug}
                  tableSlug={relatedTableSlug}
                  filters={filters}
                  onChange={filterChangeHandler}
                />
              </FRow>
            ))}
          </div>
        )}

        <div className={styles.tableBlock}>
          {viewPermission && (
            <ObjectDataTable
              selectedTab={selectedTab}
              relOptions={relOptions}
              defaultLimit={getRelatedTabeSlug?.default_limit}
              relationAction={getRelatedTabeSlug}
              remove={remove}
              watch={watch}
              isRelationTable={true}
              isTableView={true}
              setFormVisible={setFormVisible}
              formVisible={formVisible}
              loader={dataFetchingLoading || deleteLoading}
              data={tableData}
              view={getRelatedTabeSlug}
              isResizeble={true}
              fields={fields}
              setDrawerState={setDrawerState}
              columns={columns}
              setFormValue={setFormValue}
              control={control}
              relatedTableSlug={relatedTableSlug}
              tableSlug={relatedTableSlug ?? tableSlug}
              removableHeight={230}
              disableFilters
              pagesCount={pageCount}
              currentPage={currentPage}
              onRowClick={navigateToEditPage}
              onDeleteClick={deleteHandler}
              onPaginationChange={setCurrentPage}
              filters={filters}
              filterChangeHandler={filterChangeHandler}
              paginationExtraButton={
                id && (
                  <SecondaryButton onClick={navigateToTablePage}>
                    Все
                  </SecondaryButton>
                )
              }
              createFormVisible={createFormVisible[getRelatedTabeSlug.id]}
              setCreateFormVisible={(val) =>
                setCreateFormVisible(relation.id, val)
              }
              limit={limit}
              setLimit={setLimit}
              summaries={relatedTable?.attributes?.summaries}
              isChecked={(row) => selectedObjects?.includes(row?.guid)}
              onCheckboxChange={!!customEvents?.length && onCheckboxChange}
              onChecked={onChecked}
              title={"Сначала нужно создать объект"}
              tableStyle={{
                borderRadius: 0,
                border: "none",
                borderBottom: "1px solid #E5E9EB",
                width: "100%",
                margin: 0,
              }}
              refetch={refetch}
              tableView={true}
              getValues={getValues}
              mainForm={mainForm}
              selectedObjectsForDelete={selectedObjectsForDelete}
              setSelectedObjectsForDelete={setSelectedObjectsForDelete}
              multipleDelete={multipleDelete}
              navigateToForm={navigateToForm}
            />
          )}
        </div>

        <Drawer
          open={drawerState}
          anchor="right"
          onClose={() => setDrawerState(null)}
          orientation="horizontal"
        >
          <FieldSettings
            closeSettingsBlock={() => setDrawerState(null)}
            isTableView={true}
            onSubmit={(index, field) => update(index, field)}
            field={drawerState}
            formType={drawerState}
            mainForm={mainForm}
            selectedTabIndex={selectedTabIndex}
            height={`calc(100vh - 48px)`}
            getRelationFields={getRelationFields}
          />
        </Drawer>
      </div>
    );
  }
);

export default RelationTable;
