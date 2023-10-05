import { Button, Drawer } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ObjectDataTable from "../../../components/DataTable/ObjectDataTable";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import useFilters from "../../../hooks/useFilters";
import useTabRouter from "../../../hooks/useTabRouter";
import useCustomActionsQuery from "../../../queries/hooks/useCustomActionsQuery";
import constructorObjectService from "../../../services/constructorObjectService";
import layoutService from "../../../services/layoutService";
import { mergeStringAndState } from "../../../utils/jsonPath";
import { pageToOffset } from "../../../utils/pageToOffset";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";
import FastFilter from "../components/FastFilter";
import styles from "./styles.module.scss";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import FieldSettings from "../../Constructor/Tables/Form/Fields/FieldSettings";
import { listToMap } from "../../../utils/listToMap";
import constructorFieldService from "../../../services/constructorFieldService";
import constructorRelationService from "../../../services/constructorRelationService";
import { generateGUID } from "../../../utils/generateID";
import RelationSettings from "../../Constructor/Tables/Form/Relations/RelationSettings";
import RelationSettingsTest from "../../Constructor/Tables/Form/Relations/RelationSettingsTest";

const TableView = ({
  tab,
  view,
  shouldGet,
  isTableView = false,
  selectedView,
  reset = () => {},
  fieldsMap,
  isDocView,
  sortedDatas = [],
  setSortedDatas,
  formVisible,
  setFormVisible,
  selectedObjects,
  checkedColumns,
  getValues,
  searchText,
  setDataLength,
  setSelectedObjects,
  selectedLinkedObject,
  selectedTabIndex,
  selectedLinkedTableSlug,
  menuItem,
  setFormValue,
  ...props
}) => {
  const { t } = useTranslation();
  const { navigateToForm } = useTabRouter();
  const navigate = useNavigate();
  const { id, slug, tableSlug, appId } = useParams();
  const { new_list } = useSelector((state) => state.filter);
  const { filters, filterChangeHandler } = useFilters(tableSlug, view.id);
  const [currentPage, setCurrentPage] = useState(1);
  const paginationInfo = useSelector((state) => state?.pagination?.paginationInfo)
  const [limit, setLimit] = useState(20);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [drawerState, setDrawerState] = useState(null);
  const [drawerStateField, setDrawerStateField] = useState(null);
  const queryClient = useQueryClient();
  const sortValues = useSelector(state => state.pagination.sortValues);
  const { i18n } = useTranslation();


  // const selectTableSlug = selectedLinkedObject
  //   ? selectedLinkedObject?.split("#")?.[1]
  //   : tableSlug;

  const mainForm = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      app_id: appId,
      // sections: [
      //   {
      //     column: "SINGLE",
      //     fields: [],
      //     label: "Детали",
      //     id: generateGUID(),
      //     icon: "circle-info.svg",
      //   },
      // ],
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

  const { fields, prepend, update, remove } = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  });

  const paginiation = useMemo(() => {
    const getObject = paginationInfo.find((el) => el?.tableSlug === tableSlug)

    return getObject?.pageLimit ?? null
  }, [paginationInfo])

  console.log('paginiation', typeof paginiation)

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList({
        table_id: id ?? menuItem?.table_id,
      });

      const getRelations = constructorRelationService.getList({
        table_slug: tableSlug,
        relation_table_slug: tableSlug,
      });
      const [{ relations = [] }, { fields = [] }] = await Promise.all([getRelations, getFieldsData]);
      mainForm.setValue("fields", fields);
      const relationsWithRelatedTableSlug = relations?.map((relation) => ({
        ...relation,
        relatedTableSlug: relation.table_to?.slug === slug ? "table_from" : "table_to",
      }));

      const layoutRelations = [];
      const tableRelations = [];

      relationsWithRelatedTableSlug?.forEach((relation) => {
        if (
          (relation.type === "Many2One" && relation.table_from?.slug === slug) ||
          (relation.type === "One2Many" && relation.table_to?.slug === slug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" && relation.table_from?.slug === slug)
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
        label: relation?.label ?? relation[relation.relatedTableSlug]?.label ? relation[relation.relatedTableSlug]?.label : relation?.title,
      }));

      mainForm.setValue("relations", relations);
      mainForm.setValue("relationsMap", listToMap(relations));
      mainForm.setValue("layoutRelations", layoutRelationsFields);
      mainForm.setValue("tableRelations", tableRelations);
      resolve();
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      queryClient.refetchQueries("GET_OBJECTS_LIST", { tableSlug });
    });
  };

  // OLD CODE

  function customSortArray(a, b) {
    const commonItems = a?.filter((item) => b.includes(item));
    commonItems?.sort();
    const remainingItems = a?.filter((item) => !b.includes(item));
    const sortedArray = commonItems?.concat(remainingItems);
    return sortedArray;
  }

  const columns = useMemo(() => {
    const result = [];
    for (const key in view.attributes.fixedColumns) {
      if (view.attributes.fixedColumns.hasOwnProperty(key)) {
        if (view.attributes.fixedColumns[key]) result.push({ id: key, value: view.attributes.fixedColumns[key] });
      }
    }
    return customSortArray(
      view?.columns,
      result.map((el) => el.id)
    )
      ?.map((el) => fieldsMap[el])
      ?.filter((el) => el);
  }, [view, fieldsMap]);

  const columnss = useMemo(() => {
    return view?.columns?.map((el) => fieldsMap[el])?.filter((el) => el);
  }, [view, fieldsMap]);

  const computedSortColumns = useMemo(() => {
    const resultObject = {};
  
    let a = sortedDatas?.map((el) => {
      if (el.field) {
        return {
          [fieldsMap[el?.field].slug]: el.order === "ASC" ? 1 : -1,
        };
      }
    });
  
    a.forEach((obj) => {
      for (const key in obj) {
        resultObject[key] = obj[key];
      }
    });

  
    if (sortValues && sortValues.length > 0) {
      const matchingSort = sortValues.find(entry => entry.tableSlug === tableSlug);
  
      if (matchingSort) {
        const { field, order } = matchingSort;
        const sortKey = fieldsMap[field].slug;
        resultObject[sortKey] = order === "ASC" ? 1 : -1;
      }
    }
  
    return resultObject
  }, [sortedDatas, fieldsMap]);


  const detectStringType = (inputString) => {
    if (/^\d+$/.test(inputString)) {
      return "number";
    } else {
      return "string";
    }
  };
  const [combinedTableData, setCombinedTableData] = useState([]);

  const {
    data: { tableData, pageCount, fiedlsarray, fieldView } = {
      tableData: [],
      pageCount: 1,
      fieldView: [],
      fiedlsarray: [],
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
        checkedColumns,
        limit,
        filters: { ...filters, [tab?.slug]: tab?.value },
        shouldGet,
      },
    ],
    queryFn: () => {
      return constructorObjectService.getList(tableSlug, {
        data: {
          offset: paginiation ? paginiation === 'all' : limit === "all" ? undefined : pageToOffset(currentPage, limit),
          // app_id: appId,
          order: computedSortColumns,
          // with_relations: true,
          view_fields: checkedColumns,
          search: detectStringType(searchText) === "number" ? parseInt(searchText) : searchText,
          limit: limit === "all" ? undefined : limit,
          ...filters,
          [tab?.slug]: tab ? (Object.values(fieldsMap).find((el) => el.slug === tab?.slug)?.type === "MULTISELECT" ? [`${tab?.value}`] : tab?.value) : undefined,
        },
      });
    },
    select: (res) => {
      return {
        fiedlsarray: res?.data?.fields ?? [],
        fieldView: res?.data?.views ?? [],
        tableData: res.data?.response ?? [],
        pageCount: isNaN(res.data?.count) ? 1 : Math.ceil(res.data?.count / limit),
      };
    },
    onSuccess: (data) => {
      const checkdublicate = combinedTableData?.filter((item) => {
        return data?.tableData?.find((el) => el.guid === item.guid);
      });
      const result = data?.tableData?.filter((item) => {
        return !checkdublicate?.find((el) => el.guid === item.guid);
      });
      setCombinedTableData((prev) => [...prev, ...result]);
    },
  });

  // ==========FILTER FIELDS=========== //
  const getFilteredFilterFields = useMemo(() => {
    const filteredFieldsView =
      fieldView &&
      fieldView?.find((item) => {
        return item?.type === "TABLE" && item?.quick_filters;
      });
    const quickFilters = filteredFieldsView?.quick_filters?.map((el) => {
      return el?.field_id;
    });
    const filteredFields = fiedlsarray?.filter((item) => {
      return quickFilters?.includes(item.id);
    });

    return filteredFields;
  }, [fieldView, fiedlsarray]);

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
  }, [tableData, reset]);

  const { data: { custom_events: customEvents = [] } = {} } = useCustomActionsQuery({
    tableSlug,
  });

  const onCheckboxChange = (val, row) => {
    if (val) setSelectedObjects((prev) => [...prev, row.guid]);
    else setSelectedObjects((prev) => prev.filter((id) => id !== row.guid));
  };

  const deleteHandler = async (row) => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.delete(tableSlug, row.guid);
      refetch();
    } finally {
      setDeleteLoader(false);
    }
  };

  const [layoutType, setLayoutType] = useState("SimpleLayout");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    layoutService
      .getList({
        "table-slug": tableSlug,
        language_setting: i18n?.language,
      })
      .then((res) => {
        res?.layouts?.find((layout) => {
          layout.type === "PopupLayout" ? setLayoutType("PopupLayout") : setLayoutType("SimpleLayout");
        });
      });
  }, [tableSlug, i18n?.language]);

  const navigateToEditPage = (row) => {
    if (layoutType === "PopupLayout") {
      setOpen(true);
    } else {
      navigateToDetailPage(row);
    }
  };

  const navigateToDetailPage = (row) => {
    if (view?.navigate?.params?.length || view?.navigate?.url) {
      const params = view.navigate?.params?.map((param) => `${mergeStringAndState(param.key, row)}=${mergeStringAndState(param.value, row)}`).join("&&");
      const result = `${view?.navigate?.url}${params ? "?" + params : ""}`;
      navigate(result);
    } else {
      navigateToForm(tableSlug, "EDIT", row);
    }
  };

  useEffect(() => {
    refetch();
  }, [view?.quick_filters?.length, refetch]);

  const openFieldSettings = () => {
    setDrawerState("CREATE");
  };

  const [selectedObjectsForDelete, setSelectedObjectsForDelete] = useState([]);

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

  const [elementHeight, setElementHeight] = useState(null);

  useEffect(() => {
    const element = document.querySelector("#data-table");
    if (element) {
      const height = element.getBoundingClientRect().height;
      setElementHeight(height);
    }
  }, []);

  console.log('ssssssswwwwwww', tableData)

  return (
    <div className={styles.wrapper}>
      {(view?.quick_filters?.length > 0 || (new_list[tableSlug] && new_list[tableSlug].some((i) => i.checked))) && (
        <div className={styles.filters}>
          <p>{t("filters")}</p>
          <FastFilter view={view} fieldsMap={fieldsMap} getFilteredFilterFields={getFilteredFilterFields} isVertical />
        </div>
      )}
      <PermissionWrapperV2 tableSlug={tableSlug} type={"read"}>
        <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }} id="data-table">
          {tableData && (
            <ObjectDataTable
              defaultLimit={view?.default_limit}
              formVisible={formVisible}
              getValues={getValues}
              selectedView={selectedView}
              setSortedDatas={setSortedDatas}
              sortedDatas={sortedDatas}
              setDrawerState={setDrawerState}
              setDrawerStateField={setDrawerStateField}
              isTableView={true}
              elementHeight={elementHeight}
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
              limit={limit}
              setLimit={setLimit}
              onPaginationChange={setCurrentPage}
              loader={tableLoader}
              data={tableData}
              summaries={view?.attributes?.summaries}
              disableFilters
              isChecked={(row) => selectedObjects?.includes(row.guid)}
              onCheckboxChange={!!customEvents?.length && onCheckboxChange}
              filters={filters}
              filterChangeHandler={filterChangeHandler}
              onRowClick={navigateToEditPage}
              onDeleteClick={deleteHandler}
              tableSlug={tableSlug}
              view={view}
              tableStyle={{
                borderRadius: 0,
                border: "none",
                borderBottom: "1px solid #E5E9EB",
                width: "100%",
                margin: 0,
              }}
              isResizeble={true}
              {...props}
            />
          )}
        </div>
      </PermissionWrapperV2>

      <ModalDetailPage open={open} setOpen={setOpen} />

      <Drawer open={drawerState} anchor="right" onClose={() => setDrawerState(null)} orientation="horizontal">
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

      <Drawer open={drawerStateField} anchor="right" onClose={() => setDrawerState(null)} orientation="horizontal">
        <RelationSettingsTest
          relation={drawerStateField}
          closeSettingsBlock={() => setDrawerStateField(null)}
          getRelationFields={getRelationFields}
          formType={drawerStateField}
          height={`calc(100vh - 48px)`}
        />
      </Drawer>
    </div>
  );
};

export default TableView;
