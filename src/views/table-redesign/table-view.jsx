import useFilters from "@/hooks/useFilters";
import useTabRouter from "@/hooks/useTabRouter";
import MaterialUIProvider from "@/providers/MaterialUIProvider";
import constructorFieldService from "@/services/constructorFieldService";
import constructorObjectService from "@/services/constructorObjectService";
import constructorRelationService from "@/services/constructorRelationService";
import constructorTableService from "@/services/constructorTableService";
import layoutService from "@/services/layoutService";
import {quickFiltersActions} from "@/store/filter/quick_filter";
import {generateGUID} from "@/utils/generateID";
import {mergeStringAndState} from "@/utils/jsonPath";
import {listToMap} from "@/utils/listToMap";
import {pageToOffset} from "@/utils/pageToOffset";
import FieldSettings from "@/views/Constructor/Tables/Form/Fields/FieldSettings";
import RelationSettings from "@/views/Constructor/Tables/Form/Relations/RelationSettings";
import styles from "@/views/Objects/style.module.scss";
import {DynamicTable} from "@/views/table-redesign";
import {Drawer} from "@mui/material";
import {lazy, useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import useSearchParams from "../../hooks/useSearchParams";
import menuService from "../../services/menuService";
import {detailDrawerActions} from "../../store/detailDrawer/detailDrawer.slice";
import {groupFieldActions} from "../../store/groupField/groupField.slice";
import {updateQueryWithoutRerender} from "../../utils/useSafeQueryUpdater";
import DrawerDetailPage from "../Objects/DrawerDetailPage";
import OldDrawerDetailPage from "../Objects/DrawerDetailPage/OldDrawerDetailPage";
import ModalDetailPage from "@/views/Objects/ModalDetailPage/ModalDetailPage";
import OldModalDetailPage from "../Objects/ModalDetailPage/OldModalDetailPage";

const TableView = ({
  relationView = false,
  selectedRow,
  layoutType,
  filterVisible,
  currentPage,
  handleClickFilter,
  handleCloseFilter,
  visibleColumns,
  visibleRelationColumns,
  isVisibleLoading,
  visibleForm,
  filterAnchor,
  tab,
  view: viewProp,
  shouldGet,
  isTableView = false,
  selectedView,
  fieldsMap,
  isDocView,
  sortedDatas = [],
  formVisible,
  selectedObjects,
  checkedColumns,
  getValues,
  searchText,
  selectedLinkedObject,
  selectedLinkedTableSlug,
  menuItem,
  currentView,
  watch,
  tableLan,
  tableSlugProp = "",
  projectInfo,
  setSortedDatas = () => {},
  setSelectedObjects = () => {},
  setFormVisible = () => {},
  setCurrentPage = () => {},
  setFilterVisible = () => {},
  reset = () => {},
  setFormValue = () => {},
  setSelectedRow = () => {},
  setLayoutType = () => {},
  setSelectedView = () => {},
  setOrderBy = () => {},
  orderBy,
  ...props
}) => {
  const { t } = useTranslation();
  const { navigateToForm } = useTabRouter();
  const navigate = useNavigate();
  const open = useSelector((state) => state?.drawer?.openDrawer);
  const { views: viewFromStore } = useSelector((state) => state.views);
  const [searchParams] = useSearchParams();

  const {
    id,
    menuId: menuid,
    tableSlug: tableSlugFromParams,
    appId,
  } = useParams();
  const new_router = localStorage.getItem("new_router") === "true";
  const viewId = searchParams.get("v") ?? viewProp?.id;
  const urlSearchParams = new URLSearchParams(window.location.search);
  const fieldSlug = urlSearchParams.get("field_slug");

  const view = viewFromStore?.find((view) => view?.id === viewId);

  const tableSlug =
    fieldSlug ||
    view?.relation_table_slug ||
    tableSlugFromParams ||
    view?.table_slug;

  const { filters, filterChangeHandler } = useFilters(tableSlug, view?.id);

  const dispatch = useDispatch();
  const paginationInfo = useSelector(
    (state) => state?.pagination?.paginationInfo
  );
  const [limit, setLimit] = useState(20);
  const [selectedObjectsForDelete, setSelectedObjectsForDelete] = useState([]);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [drawerState, setDrawerState] = useState(null);
  const [drawerStateField, setDrawerStateField] = useState(null);
  const queryClient = useQueryClient();
  const sortValues = useSelector((state) => state.pagination.sortValues);
  const [combinedTableData, setCombinedTableData] = useState([]);
  const menuId = menuid ?? searchParams.get("menuId");
  const mainTabIndex = useSelector((state) => state.drawer.mainTabIndex);
  const drawerTabIndex = useSelector((state) => state.drawer.drawerTabIndex);
  const initialTableInf = useSelector((state) => state.drawer.tableInfo);
  const selectedTabIndex = relationView ? drawerTabIndex : mainTabIndex;

  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage") === "FullPage"
      ? "SidePeek"
      : localStorage?.getItem("detailPage")
  );

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
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
    mode: "all",
  });

  const { update } = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  });

  const paginiation = useMemo(() => {
    const getObject = paginationInfo.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageLimit ?? limit;
  }, [paginationInfo, tableSlug]);

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList({
        table_id: id ?? menuItem?.table_id ?? initialTableInf?.id,
      });

      const getRelations = constructorRelationService.getList(
        {
          table_slug: tableSlug,
          relation_table_slug: tableSlug,
        },
        {},
        tableSlug
      );
      const [{ relations = [] }, { fields = [] }] = await Promise.all([
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
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  function customSortArray(a, b) {
    const commonItems = a?.filter((item) => b.includes(item));
    commonItems?.sort();
    const remainingItems = a?.filter((item) => !b.includes(item));
    const sortedArray = commonItems?.concat(remainingItems);
    return sortedArray;
  }

  const columns = useMemo(() => {
    const result = [];
    for (const key in view?.attributes.fixedColumns) {
      if (view?.attributes.fixedColumns.hasOwnProperty(key)) {
        if (view?.attributes.fixedColumns[key]) {
          result.push({ id: key, value: view?.attributes.fixedColumns[key] });
        }
      }
    }

    const uniqueIdsSet = new Set();
    const uniqueColumns = view?.columns?.filter((column) => {
      if (!uniqueIdsSet.has(column)) {
        uniqueIdsSet.add(column);
        return true;
      }
      return false;
    });

    return customSortArray(
      uniqueColumns,
      result.map((el) => el.id)
    )
      ?.map((el) => fieldsMap[el])
      ?.filter((el) => el);
  }, [view, fieldsMap]);

  const computedSortColumns = useMemo(() => {
    const resultObject = {};

    let a = sortedDatas
      ?.map((el) => {
        if (el?.field && el?.order === "ASC") {
          return {
            [fieldsMap[el?.field]?.slug]: 1,
          };
        } else if (el?.order === "DESC") {
          return undefined;
        }
      })
      .filter(Boolean);

    a.forEach((obj) => {
      for (const key in obj) {
        if (key) {
          resultObject[key] = obj[key];
        }
      }
    });

    if (sortValues && sortValues.length > 0) {
      const matchingSort = sortValues.find(
        (entry) => entry.tableSlug === tableSlug
      );

      if (matchingSort) {
        const { field, order } = matchingSort;
        const sortKey = fieldsMap[field]?.slug;
        if (sortKey) {
          resultObject[sortKey] = order === "ASC" ? 1 : -1;
        }
      }
    }

    return resultObject;
  }, [sortedDatas, fieldsMap]);

  const detectStringType = (inputString) => {
    if (/^\d+$/.test(inputString)) {
      return "number";
    } else {
      return "string";
    }
  };

  useEffect(() => {
    if (
      Object.values(filters).length > 0 &&
      Object.values(filters)?.find((el) => el !== undefined)
    ) {
      setCurrentPage(1);
    }
  }, [filters]);

  const {
    data: { fiedlsarray, fieldView, custom_events } = {
      tableData: [],
      pageCount: 1,
      fieldView: [],
      fiedlsarray: [],
      custom_events: [],
    },
  } = useQuery({
    queryKey: [
      "GET_TABLE_INFO",
      {
        tableSlug,
        shouldGet,
      },
    ],
    queryFn: () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {},
      });
    },
    enabled: Boolean(tableSlug),
    select: (res) => {
      return {
        fiedlsarray: res?.data?.fields ?? [],
        fieldView: res?.data?.views ?? [],
        custom_events: res?.data?.custom_events ?? [],
        orderBy: res?.data?.table_info?.order_by || false,
      };
    },
    onSuccess: (data) => {
      setOrderBy(data?.orderBy);
    },
  });

  const tableSearch =
    detectStringType(searchText) === "number"
      ? parseInt(searchText)
      : searchText;

  const {
    data: { tableData, pageCount, dataCount } = {
      tableData: [],
      pageCount: 1,
      fieldView: [],
      fiedlsarray: [],
      dataCount: 0,
    },
    refetch,
    isLoading: tableLoader,
  } = useQuery({
    queryKey: [
      "GET_OBJECTS_LIST",
      {
        tableSlug,
        searchText,
        sortedDatas,
        currentPage,
        limit,
        filters: { ...filters, [tab?.slug]: tab?.value },
        shouldGet,
        paginiation,
        orderBy,
      },
    ],

    queryFn: () => {
      return menuService.getFieldsTableData(menuId, viewId, tableSlug, {
        data: {
          row_view_id: view?.id,
          offset: pageToOffset(currentPage, paginiation),
          order: computedSortColumns,
          view_fields: checkedColumns,
          search: tableSearch,
          limit: paginiation ?? limit,
          ...filters,
          [tab?.slug]: tab
            ? Object.values(fieldsMap).find((el) => el.slug === tab?.slug)
                ?.type === "MULTISELECT"
              ? [`${tab?.value}`]
              : tab?.value
            : "",
        },
      });
    },
    enabled: Boolean(tableSlug && menuId && viewId),
    select: (res) => {
      return {
        tableData: res.data?.response ?? [],
        pageCount: isNaN(res.data?.count)
          ? 1
          : Math.ceil(res.data?.count / (paginiation ?? limit)),
        dataCount: res?.data?.count,
      };
    },
    onSuccess: (data) => {
      const checkdublicate =
        combinedTableData?.filter((item) => {
          return data?.tableData?.find((el) => el.guid === item.guid);
        }) ?? [];
      const result =
        data?.tableData?.filter((item) => {
          return !checkdublicate?.find((el) => el.guid === item.guid);
        }) ?? [];
      setCombinedTableData((prev) => [...prev, ...result]);
      setIsLoading(false);
    },
  });

  const {
    data: { layout } = {
      layout: [],
    },
  } = useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
      },
    ],
    enabled: Boolean(tableSlug && menuId),
    queryFn: () => {
      return layoutService.getLayout(tableSlug, menuId);
    },
    select: (data) => {
      return {
        layout: data ?? {},
      };
    },
    onSuccess: (data) => {
      if (data?.layout?.type === "PopupLayout") {
        setLayoutType("PopupLayout");
      } else {
        setLayoutType("SimpleLayout");
      }
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  const deleteHandler = async (row) => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.delete(tableSlug, row.guid);
      refetch();
    } finally {
      setDeleteLoader(false);
    }
  };

  const navigateToEditPage = (row) => {
    dispatch(
      groupFieldActions.addView({
        id: view?.id,
        label: view?.table_label || initialTableInf?.label,
        table_slug: view?.table_slug,
        relation_table_slug: view.relation_table_slug ?? null,
        is_relation_view: view?.is_relation_view,
        detailId: row?.guid,
      })
    );
    if (Boolean(selectedView?.is_relation_view)) {
      setSelectedView(view);
      setSelectedRow(row);
      dispatch(detailDrawerActions.openDrawer());
      updateQueryWithoutRerender("p", row?.guid);
    } else {
      if (new_router) {
        console.log("2");
        updateQueryWithoutRerender("p", row?.guid);
        if (view?.attributes?.url_object) {
          navigateToDetailPage(row);
        } else if (projectInfo?.new_layout) {
          console.log("4");
          setSelectedRow(row);
          dispatch(detailDrawerActions.openDrawer());
        } else {
          if (layoutType === "PopupLayout") {
            setSelectedRow(row);
            dispatch(detailDrawerActions.openDrawer());
          } else {
            navigateToDetailPage(row);
          }
        }
      } else {
        if (view?.attributes?.url_object) {
          navigateToDetailPage(row);
        } else if (projectInfo?.new_layout) {
          setSelectedRow(row);
          dispatch(detailDrawerActions.openDrawer());
        } else {
          if (layoutType === "PopupLayout") {
            setSelectedRow(row);
            dispatch(detailDrawerActions.openDrawer());
          } else {
            navigateToDetailPage(row);
          }
        }
      }
    }
  };

  const navigateCreatePage = (row) => {
    if (projectInfo?.new_layout) {
      setSelectedRow(row);
      dispatch(detailDrawerActions.openDrawer());
    } else {
      if (layoutType === "PopupLayout") {
        setSelectedRow(row);
        dispatch(detailDrawerActions.openDrawer());
      } else {
        navigateToForm(tableSlug, "CREATE", {}, {}, menuId);
      }
    }
  };

  const replaceUrlVariables = (urlTemplate, data) => {
    return urlTemplate.replace(/\{\{\$(\w+)\}\}/g, (_, variable) => {
      return data[variable] || "";
    });
  };

  const navigateToDetailPage = (row) => {
    if (
      view?.attributes?.navigate?.params?.length ||
      view?.attributes?.navigate?.url
    ) {
      const params = view?.attributes?.navigate?.params
        ?.map(
          (param) =>
            `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
              param.value,
              row
            )}`
        )
        .join("&");

      const urlTemplate = view?.attributes?.navigate?.url;

      const matches = replaceUrlVariables(urlTemplate, row);

      navigate(`${matches}${params ? "?" + params : ""}`);
    } else {
      if (new_router)
        navigate(`/${menuId}/detail?p=${row?.guid}`, {
          state: {
            viewId,
            tableSlug,
          },
        });
      else navigateToForm(tableSlug, "EDIT", row, {}, menuItem?.id ?? appId);
    }
  };

  const multipleDelete = async () => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.deleteMultiple(tableSlug, {
        ids: selectedObjectsForDelete.map((i) => i.guid),
      });
      refetch();
    } finally {
      setDeleteLoader(false);
    }
  };

  const openFieldSettings = () => {
    setDrawerState("CREATE");
  };

  useEffect(() => {
    if (isNaN(parseInt(view?.default_limit))) setLimit(20);
    else setLimit(parseInt(view?.default_limit));
  }, [view?.default_limit]);

  useEffect(() => {
    if (tableData?.length > 0) {
      reset({
        multi: tableData.map((i) => i),
      });
    }
  }, [reset, tableData]);

  useEffect(() => {
    if (tableSlug) {
      refetch();
    }
    dispatch(
      quickFiltersActions.setQuickFiltersCount(
        view?.attributes?.quick_filters?.length ?? 0
      )
    );
  }, [view?.attributes?.quick_filters?.length, refetch]);

  useEffect(() => {
    if (localStorage.getItem("detailPage") === "undefined") {
      setSelectedViewType("SidePeek");
      localStorage.setItem("detailPage", "SidePeek");
    }
  }, [localStorage.getItem("detailPage")]);

  return (
    <MaterialUIProvider>
      <div id="wrapper_drag" className={styles.wrapper}>
        <DynamicTable
          projectInfo={projectInfo}
          tableLan={tableLan}
          custom_events={custom_events}
          dataCount={dataCount}
          refetch={refetch}
          filterVisible={filterVisible}
          currentView={currentView}
          tableView={true}
          defaultLimit={view?.default_limit}
          formVisible={formVisible}
          selectedView={selectedView}
          setSortedDatas={setSortedDatas}
          sortedDatas={sortedDatas}
          setDrawerState={setDrawerState}
          setDrawerStateField={setDrawerStateField}
          isTableView={true}
          getValues={getValues}
          setFormVisible={setFormVisible}
          setFormValue={setFormValue}
          mainForm={mainForm}
          isRelationTable={false}
          removableHeight={isDocView ? 150 : 170}
          currentPage={currentPage}
          pagesCount={pageCount}
          selectedObjectsForDelete={selectedObjectsForDelete}
          setSelectedObjectsForDelete={setSelectedObjectsForDelete}
          columns={columns}
          multipleDelete={multipleDelete}
          openFieldSettings={openFieldSettings}
          limit={paginiation ?? limit}
          setLimit={setLimit}
          onPaginationChange={setCurrentPage}
          loader={tableLoader || deleteLoader}
          data={tableData}
          navigateToEditPage={navigateCreatePage}
          summaries={view?.attributes?.summaries}
          disableFilters
          isChecked={(row) => selectedObjects?.includes(row.guid)}
          filters={filters}
          filterChangeHandler={filterChangeHandler}
          onRowClick={navigateToEditPage}
          onDeleteClick={deleteHandler}
          tableSlug={tableSlug}
          watch={watch}
          view={view}
          tableStyle={{
            borderRadius: 0,
            border: "none",
            borderBottom: "1px solid #E5E9EB",
            width: "100%",
            margin: 0,
          }}
          isResizeble={true}
          navigateToForm={navigateToForm}
          menuItem={menuItem}
          {...props}
        />

        {Boolean(open && projectInfo?.new_layout) &&
        selectedViewType === "SidePeek" ? (
          new_router ? (
            <DrawerDetailPage
              view={view}
              projectInfo={projectInfo}
              open={open}
              setFormValue={setFormValue}
              selectedRow={selectedRow}
              menuItem={menuItem}
              layout={layout}
              fieldsMap={fieldsMap}
              refetch={refetch}
              layoutType={layoutType}
              setLayoutType={setLayoutType}
              selectedViewType={selectedViewType}
              setSelectedViewType={setSelectedViewType}
              navigateToEditPage={navigateToDetailPage}
            />
          ) : (
            <OldDrawerDetailPage
              view={view}
              projectInfo={projectInfo}
              open={open}
              setFormValue={setFormValue}
              selectedRow={selectedRow}
              menuItem={menuItem}
              layout={layout}
              fieldsMap={fieldsMap}
              refetch={refetch}
              layoutType={layoutType}
              setLayoutType={setLayoutType}
              selectedViewType={selectedViewType}
              setSelectedViewType={setSelectedViewType}
              navigateToEditPage={navigateToDetailPage}
            />
          )
        ) : selectedViewType === "CenterPeek" ? (
          Boolean(new_router) ? (
            <ModalDetailPage
              view={view}
              projectInfo={projectInfo}
              open={open}
              setFormValue={setFormValue}
              selectedRow={selectedRow}
              menuItem={menuItem}
              layout={layout}
              fieldsMap={fieldsMap}
              refetch={refetch}
              layoutType={layoutType}
              setLayoutType={setLayoutType}
              selectedViewType={selectedViewType}
              setSelectedViewType={setSelectedViewType}
              navigateToEditPage={navigateToDetailPage}
              tableSlug={tableSlug}
            />
          ) : (
            <OldModalDetailPage
              open={open}
              selectedRow={selectedRow}
              menuItem={menuItem}
              layout={layout}
              fieldsMap={fieldsMap}
              refetch={refetch}
              setLayoutType={setLayoutType}
              selectedViewType={selectedViewType}
              setSelectedViewType={setSelectedViewType}
              navigateToEditPage={navigateToDetailPage}
            />
          )
        ) : null}

        {Boolean(open && !projectInfo?.new_layout) && (
          <ModalDetailPage
            open={open}
            selectedRow={selectedRow}
            menuItem={menuItem}
            layout={layout}
            fieldsMap={fieldsMap}
            refetch={refetch}
            setLayoutType={setLayoutType}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
            navigateToEditPage={navigateToDetailPage}
            tableSlug={tableSlug}
            modal
          />
        )}

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
            menuItem={menuItem}
          />
        </Drawer>

        <Drawer
          open={drawerStateField}
          anchor="right"
          onClose={() => setDrawerState(null)}
          orientation="horizontal"
        >
          <RelationSettings
            relation={drawerStateField}
            closeSettingsBlock={() => setDrawerStateField(null)}
            getRelationFields={getRelationFields}
            formType={drawerStateField}
            height={`calc(100vh - 48px)`}
          />
        </Drawer>
      </div>
    </MaterialUIProvider>
  );
};

export default TableView;
