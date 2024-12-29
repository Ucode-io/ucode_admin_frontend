import {useMemo} from "react";

function AggridDefaultComponents() {
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
  return {
    defaultColDef,
    autoGroupColumnDef,
    rowSelection,
  };
}

export default AggridDefaultComponents;

export const IndexColumn = {
  headerName: "№",
  field: "button",
  width: 80,
  height: 40,
  suppressSizeToFit: true,
  suppressMenu: true,
  sortable: false,
  filter: false,
  editable: false,
  pinned: "left",
  cellClass: "indexClass",
};

export const ActionsColumn = {
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
};
