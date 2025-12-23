import { ModuleRegistry , ClientSideRowModelModule, themeQuartz } from "ag-grid-community";
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
  } = usePivotProps();

  return  <div style={{ width: "100%", height: "100%" }}>
    <AgGridReact
      columnDefs={columns}
      autoGroupColumnDef={autoGroupColumnDef}
      onColumnPivotModeChanged={onColumnStateChanged}
      ref={gridApi}
      theme={myTheme}
      onGridReady={onGridReady}
      rowData={rowData}
      rowModelType="clientSide"
      rowSelection={rowSelection}
      cellSelection={cellSelection}
      sideBar={{
        toolPanels: ["columns"],
        defaultToolPanel: "columns",
      }}
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
}
