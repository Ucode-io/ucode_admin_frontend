import constructorObjectService from "../../../services/constructorObjectService";
import constructorTableService from "../../../services/constructorTableService";
import constructorViewService from "../../../services/constructorViewService";
import {ClientSideRowModelModule, ModuleRegistry} from "ag-grid-community";
import React, {useEffect, useMemo, useRef, useState} from "react";
import getColumnEditorParams from "./valueOptionGenerator";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-grid.css";
import {AgGridReact} from "ag-grid-react";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {
  ClipboardModule,
  ColumnsToolPanelModule,
  MenuModule,
  RangeSelectionModule,
} from "ag-grid-enterprise";
import {useTranslation} from "react-i18next";
import FiltersBlock from "./FiltersBlock";
import {Box, Button} from "@mui/material";
import FastFilter from "../components/FastFilter";
import style from "./style.module.scss";
import useFilters from "../../../hooks/useFilters";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  MenuModule,
  RangeSelectionModule,
  ColumnsToolPanelModule,
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
}) {
  const {tableSlug} = useParams();
  const {i18n, t} = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const pinFieldsRef = useRef({});
  const {filters, filterChangeHandler} = useFilters(tableSlug, view.id);
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 30, 40, 50];
  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const detectStringType = (inputString) => {
    if (/^\d+$/.test(inputString)) {
      return "number";
    } else {
      return "string";
    }
  };

  const tableSearch =
    detectStringType(searchText) === "number"
      ? parseInt(searchText)
      : searchText;

  const {data: tabs} = useQuery(queryGenerator(groupField, filters));
  const [groupTab, setGroupTab] = useState(null);

  const {data: {tableData} = {tableData: []}, isLoading} = useQuery(
    [
      "GET_OBJECTS_LIST_DATA",
      {
        tableSlug,
        filters: {...filters, [groupTab?.slug]: groupTab?.value, searchText},
      },
    ],
    () =>
      constructorObjectService.getListV2(tableSlug, {
        data: {
          limit: 20,
          offset: 0,
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
        setLoading(false);
        setRowData(data?.data?.response ?? []);
      },
    }
  );

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
      return {
        fiedlsarray: res?.data?.fields?.map((item) => {
          const pinnedStatus =
            view?.attributes?.pinnedFields?.[item?.id]?.pinned ?? "";
          const columnDef = {
            headerName:
              item?.attributes?.[`label_${i18n?.language}`] || item?.label,
            field: item?.slug,
            minWidth: 250,
            filter: item?.type !== "PASSWORD",
            view,
            columnID: item?.id,
            pinned: pinnedStatus,
            editable: Boolean(
              item?.disabled ||
                !!item?.attributes?.field_permission?.edit_permission
            ),
          };
          getColumnEditorParams(item, columnDef);
          return columnDef;
        }),
      };
    },
  });

  const columns = useMemo(() => {
    if (fiedlsarray?.length) {
      return fiedlsarray
        ?.filter((item) => view?.columns?.includes(item?.columnID))
        .map((el) => ({
          ...el,
          rowGroup: view?.attributes?.group_by_columns?.includes(el?.columnID)
            ? true
            : false,
        }));
    }
  }, [fiedlsarray, view]);

  const defaultColDef = useMemo(
    () => ({
      width: 200,
      autoHeaderHeight: true,
      suppressServerSideFullWidthLoadingRow: true,
    }),
    []
  );

  const autoGroupColumnDef = useMemo(() => ({minWidth: 230}), []);
  const rowSelection = useMemo(() => ({mode: "multiRow"}), []);

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
    <>
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
              rowData={rowData}
              pagination={true}
              cellSelection={true}
              suppressRefresh={true}
              columnDefs={columns}
              rowSelection={rowSelection}
              suppressServerSideFullWidthLoadingRow={true}
              loading={loading}
              defaultColDef={defaultColDef}
              autoGroupColumnDef={autoGroupColumnDef}
              paginationPageSize={paginationPageSize}
              paginationPageSizeSelector={paginationPageSizeSelector}
              onCellValueChanged={(e) => updateObject(e.data)}
              onColumnPinned={onColumnPinned}
            />
          </Box>
        </div>
      </div>
    </>
  );
}

const queryGenerator = (groupField, filters = {}) => {
  if (!groupField)
    return {
      queryFn: () => {},
    };

  const filterValue = filters[groupField.slug];
  const computedFilters = filterValue ? {[groupField.slug]: filterValue} : {};

  if (groupField?.type === "PICK_LIST" || groupField?.type === "MULTISELECT") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () =>
        groupField?.attributes?.options?.map((el) => ({
          label: el?.label ?? el.value,
          value: el?.value,
          slug: groupField?.slug,
        })),
    };
  }

  if (groupField?.type === "LOOKUP" || groupField?.type === "LOOKUPS") {
    const queryFn = () =>
      constructorObjectService.getListV2(groupField.table_slug, {
        data: computedFilters ?? {},
      });

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        {tableSlug: groupField.table_slug, filters: computedFilters},
      ],
      queryFn,
      select: (res) =>
        res?.data?.response?.map((el) => ({
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        })),
    };
  }
};

export default AgGridTableView;
