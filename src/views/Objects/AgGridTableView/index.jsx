import constructorObjectService from "../../../services/constructorObjectService";
import constructorTableService from "../../../services/constructorTableService";
import constructorViewService from "../../../services/constructorViewService";
import {ClientSideRowModelModule, ModuleRegistry} from "ag-grid-community";
import React, {useEffect, useMemo, useRef, useState} from "react";
import getColumnEditorParams from "./valueOptionGenerator";
import {AgGridReact} from "ag-grid-react";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {
  ClipboardModule,
  ColumnsToolPanelModule,
  MenuModule,
  RangeSelectionModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import {useTranslation} from "react-i18next";
import FiltersBlock from "./FiltersBlock";
import {Box, Button} from "@mui/material";
import FastFilter from "../components/FastFilter";
import style from "./style.module.scss";
import useFilters from "../../../hooks/useFilters";
import ActionButtons from "./ActionButtons";
import {generateGUID} from "../../../utils/generateID";
import {detectStringType, queryGenerator} from "./Functions/queryGenerator";
import AggridDefaultComponents from "./Functions/AggridDefaultComponents";
import RowIndexField from "./RowIndexField";
import AggridFooter from "./AggridFooter";
import IndexHeaderComponent from "./IndexHeaderComponent";
import {pageToOffset} from "../../../utils/pageToOffset";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  MenuModule,
  RangeSelectionModule,
  ColumnsToolPanelModule,
  ServerSideRowModelModule,
]);

function AgGridTableView({
  view,
  views,
  fieldsMap,
  selectedTabIndex,
  computedVisibleFields,
  checkedColumns,
  columnsForSearch,
  setCheckedColumns,
  updateField,
  visibleColumns,
  visibleRelationColumns,
  visibleForm,
  menuItem,
}) {
  const gridApi = useRef(null);
  const {tableSlug} = useParams();
  const {i18n, t} = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const pinFieldsRef = useRef({});
  const {filters, filterChangeHandler} = useFilters(tableSlug, view.id);
  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [groupTab, setGroupTab] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const {defaultColDef, autoGroupColumnDef, rowSelection} =
    AggridDefaultComponents();

  const paginationPageSize = 10;

  const tableSearch =
    detectStringType(searchText) === "number"
      ? parseInt(searchText)
      : searchText;

  const limitPage = useMemo(() => {
    return pageToOffset(offset, limit);
  }, [limit, offset]);

  const {data: tabs} = useQuery(queryGenerator(groupField, filters));

  const {isLoading, refetch} = useQuery(
    [
      "GET_OBJECTS_LIST_DATA",
      {
        tableSlug,
        filters: {
          ...filters,
          [groupTab?.slug]: groupTab?.value,
          searchText,
          offset,
          limit,
        },
      },
    ],
    () =>
      constructorObjectService.getListV2(tableSlug, {
        data: {
          limit: limit,
          offset: Boolean(searchText) || Boolean(limitPage < 0) ? 0 : limitPage,
          view_fields: checkedColumns,
          search: tableSearch,
          ...filters,
          [groupTab?.slug]: groupTab
            ? Object.values(fieldsMap).find((el) => el.slug === groupTab?.slug)
                ?.type === "MULTISELECT"
              ? [`${groupTab?.value}`]
              : groupTab?.value
            : "",
        },
      }),
    {
      enabled: !!tableSlug,
      onSuccess: (data) => {
        setCount(data?.data?.count);
        setLoading(false);
        setRowData(data?.data?.response ?? []);
      },
    }
  );

  const deleteHandler = (row) => {
    constructorObjectService.delete(tableSlug, row.guid).then(() => {
      refetch();
    });
  };

  const addRow = () => {
    setLoading(true);
    const emptyRow = {};
    constructorObjectService
      .create(tableSlug, {
        data: {},
      })
      .then((res) => {
        const newRow = {...emptyRow, id: res?.data?.id};
        gridApi.current.api.applyTransaction({
          add: [newRow],
          addIndex: 0,
        });
        refetch();
        setLoading(false);
      });
  };

  const deleteColumn = {
    headerName: "Actions",
    field: "button",
    pinned: "right",
    width: 120,
    suppressSizeToFit: true,
    sortable: false,
    filter: false,
    editable: false,
    suppressMenu: true,
    type: "ACTIONS",
    view: view,
    menuItem: menuItem,
    cellRenderer: ActionButtons,
    deleteFunction: deleteHandler,
    cellClass: "actionBtn",
  };

  const indexColumn = {
    headerName: "№",
    field: "button",
    valueGetter: (params) => {
      return (
        (Boolean(limitPage > 0) ? limitPage : 0) + params.node.rowIndex + 1
      );
    },
    width: 80,
    suppressSizeToFit: true,
    suppressMenu: true,
    sortable: false,
    filter: false,
    editable: false,
    pinned: "left",
    view: view,
    menuItem: menuItem,
    addRow: addRow,
    cellRenderer: RowIndexField,
    cellClass: "indexClass",
    headerComponent: IndexHeaderComponent,
  };

  const {
    data: {fiedlsarray} = {
      pageCount: 1,
      fiedlsarray: [],
      custom_events: [],
    },
  } = useQuery({
    queryKey: ["GET_TABLE_INFO", tableSlug, view],
    queryFn: () => constructorTableService.getTableInfo(tableSlug, {data: {}}),
    enabled: Boolean(tableSlug),
    select: (res) => {
      const primaryFields = [...res?.data?.fields, deleteColumn];
      return {
        fiedlsarray: primaryFields?.map((item) => {
          const pinnedStatus =
            view?.attributes?.pinnedFields?.[item?.id]?.pinned ?? "";
          const columnDef = {
            headerName:
              item?.attributes?.[`label_${i18n?.language}`] || item?.label,
            field: item?.slug,
            flex: 1,
            minWidth: 250,
            filter: item?.type !== "PASSWORD",
            view,
            columnID: item?.id || generateGUID(),
            pinned: pinnedStatus,
            editable: true,
            cellClass: "customFields",
          };
          getColumnEditorParams(item, columnDef);
          return columnDef;
        }),
      };
    },
  });

  const columns = useMemo(() => {
    if (fiedlsarray?.length) {
      return [
        indexColumn,
        ...fiedlsarray
          ?.filter((item) => view?.columns?.includes(item?.columnID))
          .map((el, index) => ({
            ...el,
            rowGroup: view?.attributes?.group_by_columns?.includes(el?.columnID)
              ? true
              : false,
          })),
        deleteColumn,
      ];
    }
  }, [fiedlsarray, view]);

  const getFilteredFilterFields = useMemo(() => {
    const filteredFieldsView =
      views &&
      views?.find((item) => {
        return item?.type === "TABLE" && item?.attributes?.quick_filters;
      });

    const quickFilters = filteredFieldsView?.attributes?.quick_filters?.map(
      (el) => {
        return el?.field_id;
      }
    );
    const filteredFields = fiedlsarray?.filter((item) => {
      return quickFilters?.includes(item?.columnID);
    });

    return filteredFields;
  }, [views, fiedlsarray]);

  const updateView = (pinnedField) => {
    pinFieldsRef.current = {...pinFieldsRef.current, ...pinnedField};

    constructorViewService.update(tableSlug, {
      ...view,
      attributes: {
        ...view.attributes,
        pinnedFields: pinFieldsRef.current,
      },
    });
  };

  const updateObject = (data) => {
    constructorObjectService.update(tableSlug, {data: {...data}});
  };

  const onColumnPinned = (event) => {
    const {column, pinned} = event;
    const fieldId = column?.colDef?.columnID;

    updateView({
      [fieldId]: {pinned},
    });
  };

  useEffect(() => {
    pinFieldsRef.current = view?.attributes?.pinnedFields;
  }, [view?.attributes?.pinnedFields]);

  useEffect(() => {
    if (Boolean(tabs?.length)) {
      setGroupTab(tabs?.[0]);
    } else {
      setGroupTab(null);
    }
  }, [tabs?.length]);

  return (
    <Box sx={{height: "calc(100vh - 50px)", overflow: "scroll"}}>
      <FiltersBlock
        view={view}
        views={views}
        fieldsMap={fieldsMap}
        selectedTabIndex={selectedTabIndex}
        setFilterVisible={setFilterVisible}
        computedVisibleFields={computedVisibleFields}
        checkedColumns={checkedColumns}
        setCheckedColumns={setCheckedColumns}
        updateField={updateField}
        columnsForSearch={columnsForSearch}
        filters={filters}
        visibleRelationColumns={visibleRelationColumns}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <div className={style.gridTable}>
        <div className={!filterVisible ? style.wrapperVisible : style.wrapper}>
          {
            <Box className={style.block}>
              <p>{t("filters")}</p>
              <FastFilter
                view={view}
                fieldsMap={fieldsMap}
                getFilteredFilterFields={getFilteredFilterFields}
                isVertical
                selectedTabIndex={selectedTabIndex}
                visibleColumns={visibleColumns}
                visibleRelationColumns={visibleRelationColumns}
                visibleForm={visibleForm}
                isVisibleLoading={true}
                setFilterVisible={setFilterVisible}
              />
            </Box>
          }
        </div>
        <div
          className="ag-theme-quartz"
          style={{
            height: `calc(100vh - ${Boolean(tabs?.length) ? 154 : 95}px)`,
            display: "flex",
            width: "100%",
          }}>
          <Box sx={{width: "100%", background: "#fff"}}>
            {Boolean(tabs?.length) && (
              <Box
                sx={{
                  display: "flex",
                  padding: "15px",
                  borderBottom: "1px solid #eee",
                }}>
                {tabs?.map((item) => (
                  <Button
                    onClick={() => {
                      setLoading(true);
                      setGroupTab(item);
                    }}
                    variant="outlined"
                    className={
                      groupTab?.value === item?.value
                        ? style.tabGroupBtnActive
                        : style.tabGroupBtn
                    }>
                    {item?.label}
                  </Button>
                ))}
              </Box>
            )}
            <AgGridReact
              sideBar={false}
              ref={gridApi}
              rowData={rowData}
              cellSelection={true}
              suppressRefresh={true}
              columnDefs={columns}
              rowSelection={rowSelection}
              suppressServerSideFullWidthLoadingRow={true}
              loading={loading}
              defaultColDef={defaultColDef}
              autoGroupColumnDef={autoGroupColumnDef}
              paginationPageSize={paginationPageSize}
              onCellValueChanged={(e) => updateObject(e.data)}
              onColumnPinned={onColumnPinned}
              onSelectionChanged={(e) =>
                setSelectedRows(e.api.getSelectedRows())
              }
            />
          </Box>
        </div>
      </div>

      <AggridFooter
        view={view}
        rowData={rowData}
        selectedRows={selectedRows}
        refetch={refetch}
        setOffset={setOffset}
        setLimit={setLimit}
        limit={limit}
        count={count}
        setLoading={setLoading}
      />
    </Box>
  );
}

export default AgGridTableView;
