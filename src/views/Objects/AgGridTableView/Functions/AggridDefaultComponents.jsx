import {useMemo} from "react";
import ActionButtons from "../ActionButtons";
import RowIndexField from "../RowIndexField";
import IndexHeaderComponent from "../IndexHeaderComponent";
import FieldCreateHeaderComponent from "../FieldCreateHeaderComponent";
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
  const cellSelection = useMemo(
    () => ({
      handle: {mode: "fill", suppressClearOnFillReduction: true},
    }),
    []
  );
  return {
    rowSelection,
    cellSelection,
    defaultColDef,
    autoGroupColumnDef,
  };
}

export default AggridDefaultComponents;

export const IndexColumn = {
  width: 50,
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
