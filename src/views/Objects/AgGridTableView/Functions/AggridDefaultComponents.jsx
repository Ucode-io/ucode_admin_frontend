import {useMemo} from "react";
import constructorObjectService from "../../../../services/constructorObjectService";
import ActionButtons from "../ActionButtons";
import FieldCreateHeaderComponent from "../FieldCreateHeaderComponent";
import IndexHeaderComponent from "../IndexHeaderComponent";
import RowIndexField from "../RowIndexField";

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
  width: 80,
  height: 40,
  filter: false,
  pinned: "left",
  headerName: "№",
  field: "button",
  editable: false,
  sortable: false,
  suppressMenu: true,
  cellClass: "indexClass",
  suppressSizeToFit: true,
  cellRenderer: RowIndexField,
  headerComponent: IndexHeaderComponent,
};

export const ActionsColumn = {
  width: 120,
  filter: false,
  sortable: false,
  editable: false,
  field: "button",
  pinned: "right",
  type: "ACTIONS",
  suppressMenu: true,
  headerName: "Actions",
  suppressSizeToFit: true,
  cellRenderer: ActionButtons,
  headerComponent: FieldCreateHeaderComponent,
};

export const updateObject = (tableSlug = "", data) => {
  constructorObjectService.update(tableSlug, {data: {...data}});
};
