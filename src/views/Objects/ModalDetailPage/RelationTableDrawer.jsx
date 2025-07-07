import {Drawer} from "@mui/material";
import {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useMutation, useQueryClient} from "react-query";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorFieldService from "../../../services/constructorFieldService";
import constructorObjectService from "../../../services/constructorObjectService";
import constructorRelationService from "../../../services/constructorRelationService";
import {useMenuGetByIdQuery} from "../../../services/menuService";
import {generateGUID} from "../../../utils/generateID";
import {listToMap} from "../../../utils/listToMap";
import FieldSettings from "../../Constructor/Tables/Form/Fields/FieldSettings";
import DrawerObjectDataTable from "./DrawerObjectDataTable";
import styles from "./style.module.scss";
import RelationSettings from "../../Constructor/Tables/Form/Relations/RelationSettings";

const RelationTableDrawer = forwardRef(
  (
    {
      refetch,
      count,
      pageCount,
      columns,
      dataFetchingLoading,
      tableData,
      getValues,
      relation,
      shouldGet,
      createFormVisible,
      remove,
      setCreateFormVisible,
      watch,
      selectedObjects,
      setSelectedObjects,
      id,
      selectedTabIndex,
      control,
      setFormValue,
      fields,
      setFormVisible,
      formVisible,
      selectedTab,
      relatedTable = {},
      getAllData = () => {},
      layoutData,
      removableHeight,
      setCurrentPage = () => {},
      inputChangeHandler = () => {},
      currentPage,
      searchText,
      tableSlug,
      filters,
      setFilters,
      limit,
      setLimit,
      fieldsMap,
      getRelatedTabeSlug,
    },
    ref
  ) => {
    const {menuId} = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {navigateToForm} = useTabRouter();
    const tableRef = useRef(null);

    const [drawerState, setDrawerState] = useState(null);
    const {i18n} = useTranslation();
    const [relOptions, setRelOptions] = useState([]);
    const [searchParams] = useSearchParams();
    const [menuItem, setMenuItem] = useState(null);
    const relatedTableSlug = selectedTab?.relation.relation_table_slug;

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
        app_id: menuId,
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

    // const {loader: menuLoader} = useMenuGetByIdQuery({
    //   menuId: searchParams.get("menuId"),
    //   queryParams: {
    //     enabled: Boolean(searchParams.get("menuId")),
    //     onSuccess: (res) => {
    //       setMenuItem(res);
    //     },
    //   },
    // });

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
            (relation?.label ?? relation[relation.relatedTableSlug]?.label)
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

    //============VIEW PERMISSION=========
    const viewPermission = useMemo(() => {
      if (getRelatedTabeSlug?.permission?.view_permission) return true;
      else return false;
    }, [getRelatedTabeSlug?.permission?.view_permission]);

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
                        relationId: item?.relation_id,
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
                    relationId: item?.relation_id,
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
          refetch();
        },
      }
    );

    const navigateToEditPage = (row) => {
      navigate(`/${menuId}/detail?p=${row?.guid}`, {
        state: {
          table_slug: relatedTableSlug,
        },
      });
      // navigateToForm(relatedTableSlug, "EDIT", row, {}, menuId);
    };

    const navigateToTablePage = () => {
      navigate(`/main/${menuId}/object/${relatedTableSlug}`, {
        state: {
          [`${tableSlug}_${
            getRelatedTabeSlug.type === "Many2Many" ? "ids" : "id"
          }`]: id,
        },
      });
    };
    const [selectedObjectsForDelete, setSelectedObjectsForDelete] = useState(
      []
    );

    const multipleDelete = async () => {
      try {
        await constructorObjectService.deleteMultiple(tableSlug, {
          ids: selectedObjectsForDelete.map((i) => i.guid),
        });
        queryClient.refetchQueries("GET_OBJECTS_LIST", {tableSlug});
      } finally {
      }
    };

    const [drawerStateField, setDrawerStateField] = useState(null);

    // if (Boolean(columns?.length)) return <PageFallback />;

    return (
      <div assName={styles.relationTable} ref={tableRef}>
        <div className={styles.tableBlock}>
          {viewPermission && (
            <DrawerObjectDataTable
              fieldsMap={fieldsMap}
              selectedTab={selectedTab}
              relOptions={relOptions}
              defaultLimit={getRelatedTabeSlug?.default_limit}
              relationAction={getRelatedTabeSlug}
              remove={remove}
              getAllData={getAllData}
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
              layoutData={layoutData}
              setFormValue={setFormValue}
              control={control}
              relatedTableSlug={relatedTableSlug}
              tableSlug={tableSlug}
              removableHeight={removableHeight ? removableHeight : 230}
              disableFilters
              pageCount={pageCount}
              currentPage={currentPage}
              count={count}
              onRowClick={navigateToEditPage}
              onDeleteClick={deleteHandler}
              onPaginationChange={setCurrentPage}
              filters={filters}
              filterChangeHandler={filterChangeHandler}
              inputChangeHandler={inputChangeHandler}
              setDrawerStateField={setDrawerStateField}
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
              summaries={
                relatedTable?.attributes?.summaries ??
                getRelatedTabeSlug?.attributes?.summaries
              }
              isChecked={(row) => selectedObjects?.includes(row?.guid)}
              onChecked={onChecked}
              title={"First, you need to create an object"}
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
              menuItem={menuItem}
            />
          )}
        </div>

        <Drawer
          open={drawerState}
          anchor="right"
          onClose={() => setDrawerState(null)}
          orientation="horizontal">
          <FieldSettings
            closeSettingsBlock={() => setDrawerState(null)}
            isTableView={true}
            // onSubmit={(index, field) => update(index, field)}
            field={drawerState}
            formType={drawerState}
            mainForm={mainForm}
            selectedTabIndex={selectedTabIndex}
            height={`calc(100vh - 48px)`}
            getRelationFields={getRelationFields}
          />
        </Drawer>

        <Drawer
          open={drawerStateField}
          anchor="right"
          onClose={() => setDrawerState(null)}
          orientation="horizontal">
          <RelationSettings
            relation={drawerStateField}
            closeSettingsBlock={() => setDrawerStateField(null)}
            getRelationFields={getRelationFields}
            formType={drawerStateField}
            height={`calc(100vh - 48px)`}
          />
        </Drawer>
      </div>
    );
  }
);

export default RelationTableDrawer;
