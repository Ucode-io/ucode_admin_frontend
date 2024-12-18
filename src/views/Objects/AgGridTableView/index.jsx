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
import {Box} from "@mui/material";
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
  const [filterVisible, setFilterVisible] = useState(true);
  const pinFieldsRef = useRef({});
  const {filters, filterChangeHandler} = useFilters(tableSlug, view.id);
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 30, 40, 50];

  const {data: {tableData} = {tableData: []}, isLoading: tableLoader} =
    useQuery(
      ["GET_OBJECTS_LIST_DATA", tableSlug, filters],
      () =>
        constructorObjectService.getListV2(tableSlug, {
          data: {limit: 20, offset: 0, ...filters},
        }),
      {
        enabled: !!tableSlug,
        onSuccess: (data) => setRowData(data?.data?.response ?? []),
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
      return fiedlsarray?.filter((item) =>
        view?.columns?.includes(item?.columnID)
      );
    }
  }, [fiedlsarray, view]);

  const defaultColDef = useMemo(
    () => ({width: 200, autoHeaderHeight: true}),
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
      />
      <div className={style.gridTable}>
        <div className={filterVisible ? style.wrapperVisible : style.wrapper}>
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
                setFilterVisible={setFilterVisible}
              />
            </Box>
          }
        </div>
        <div
          className="ag-theme-quartz"
          style={{
            height: "calc(100vh - 94px)",
            display: "flex",
            width: "100%",
          }}>
          <Box sx={{width: "100%"}}>
            <AgGridReact
              AgGridReact
              sideBar={false}
              rowData={rowData}
              pagination={true}
              cellSelection={true}
              suppressRefresh={true}
              columnDefs={columns}
              rowSelection={rowSelection}
              rowGroupPanelShow={"never"}
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

export default AgGridTableView;
