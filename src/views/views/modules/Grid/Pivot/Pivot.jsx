import "./styles.scss";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  themeQuartz,
} from "ag-grid-community";
import {
  RowGroupingModule,
  PivotModule,
  ColumnsToolPanelModule,
  MenuModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  PivotModule,
  ColumnsToolPanelModule,
  MenuModule,
]);

import { usePivotProps } from "./usePivotProps";
import { AgGridReact } from "ag-grid-react";
import AggridFooter from "../AggridFooter";

const myTheme = themeQuartz.withParams({
  columnBorder: true,
  rowHeight: "32px",
  sideBarPanelWidth: "300px",
  sideBarBackgroundColor: "#f5f5f5",
});

export const Pivot = () => {
  const {
    rowData,
    columns,
    onGridReady,
    defaultColDef,
    autoGroupColumnDef,
    rowSelection,
    cellSelection,
    gridApi,
    onColumnStateChanged,
    limit,
    setLimit,
    setOffset,
    count,
    refetch,
    view,
    loadings,
    setLoadings,
    tableSlug,
    pagination,
    selectedRows,
    setSelectedRows,
    createChild,
    updateObject,
    settingsPermission,
  } = usePivotProps();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <AgGridReact
          columnDefs={columns}
          onColumnVisible={onColumnStateChanged}
          onColumnPinned={onColumnStateChanged}
          onColumnMoved={onColumnStateChanged}
          onColumnResized={onColumnStateChanged}
          onColumnRowGroupChanged={onColumnStateChanged}
          onColumnPivotChanged={onColumnStateChanged}
          onColumnValueChanged={onColumnStateChanged}
          onSelectionChanged={(e) => {
            setSelectedRows(e.api.getSelectedRows());
          }}
          paginationPageSize={pagination ?? limit}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDisplayType="single"
          onCellValueChanged={(e) => {
            updateObject(e.data);
          }}
          ref={gridApi}
          theme={myTheme}
          onGridReady={onGridReady}
          rowData={rowData}
          rowModelType="clientSide"
          rowSelection={rowSelection}
          cellSelection={cellSelection}
          loading={loadings}
          sideBar={settingsPermission}
          defaultColDef={{
            ...defaultColDef,
            flex: 1,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            resizable: true,
          }}
        />
      </div>
      <AggridFooter
        view={view}
        limit={pagination ?? limit}
        count={count}
        rowData={rowData}
        refetch={refetch}
        setLimit={setLimit}
        setOffset={setOffset}
        setLoading={setLoadings}
        createChild={createChild}
        selectedRows={selectedRows}
        tableSlug={tableSlug}
      />
    </div>
  );
};
