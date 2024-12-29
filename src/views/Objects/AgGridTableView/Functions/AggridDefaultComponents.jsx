import {useMemo} from "react";
import ActionButtons from "../ActionButtons";
import RowIndexField from "../RowIndexField";
import IndexHeaderComponent from "../IndexHeaderComponent";
import constructorObjectService from "../../../../services/constructorObjectService";

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
  cellRenderer: RowIndexField,
  headerComponent: IndexHeaderComponent,
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
  cellRenderer: ActionButtons,
};

export const updateObject = (tableSlug = "", data) => {
  constructorObjectService.update(tableSlug, {data: {...data}});
};
