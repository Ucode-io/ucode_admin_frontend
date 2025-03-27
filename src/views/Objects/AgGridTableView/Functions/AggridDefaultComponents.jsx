import {useMemo} from "react";
import ActionButtons from "../ActionButtons";
import RowIndexField from "../RowIndexField";
import IndexHeaderComponent from "../IndexHeaderComponent";
import FieldCreateHeaderComponent from "../FieldCreateHeaderComponent";
import constructorObjectService from "../../../../services/constructorObjectService";

function AggridDefaultComponents({customAutoGroupColumnDef}) {
  const {view, fields} = customAutoGroupColumnDef;

  const defaultColDef = useMemo(
    () => ({
      width: 200,
      autoHeaderHeight: true,
      suppressServerSideFullWidthLoadingRow: true,
      enableRangeSelection: true,
      enableFillHandle: true,
      fillHandleDirection: "xy",
      suppressMultiRangeSelection: false,
    }),
    []
  );

  const autoGroupColumnDef = useMemo(
    () => ({
      minWidth: 230,
      field: "name",
      cellRendererParams: {
        suppressCount: true,
      },
      minWidth: 280,

      cellRendererParams: {
        innerRenderer: (params) => {
          return (
            <div style={{display: "flex", alignItems: "center"}}>
              {params.value}
            </div>
          );
        },
        checkbox: true,
      },
    }),
    []
  );
  const rowSelection = useMemo(
    () => ({
      mode: "multiRow",
      checkboxes: false,
      headerCheckbox: false,
    }),
    []
  );
  const cellSelection = useMemo(
    () => ({
      handle: {
        mode: "fill",
        direction: "y",
      },
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
  width: 45,
  height: 32,
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
  width: 45,
  height: 32,
  filter: false,
  sortable: false,
  editable: false,
  field: "button",
  pinned: "right",
  type: "ACTIONS",
  suppressMenu: true,
  headerName: "Actions",
  suppressSizeToFit: true,
  suppressMovable: true,
  suppressPaste: true,
  editable: false,
  cellRenderer: ActionButtons,
  headerComponent: FieldCreateHeaderComponent,
};

export const updateObject = (tableSlug = "", data) => {
  constructorObjectService.update(tableSlug, {data: {...data}});
};
