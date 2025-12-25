import {useMemo} from "react";
import constructorObjectService from "@/services/constructorObjectService";
import { GridActionButtons } from "../../../components/GridActionButtons";
import { RowIndexField } from "../../../components/RowIndexField";
import { IndexHeaderComponent } from "../../../components/IndexHeaderComponent";
import { FieldCreateHeaderComponent } from "../../../components/FieldCreateHeaderComponent";

export const useGridParams = ({customAutoGroupColumnDef}) => {
  const {fields, tableSlug} = customAutoGroupColumnDef;

  const recursiveField = fields?.find((el) => el?.table_slug === tableSlug);

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
      field: recursiveField?.view_fields?.[1]?.slug,
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: (params) => {
          return (
            <div style={{display: "flex", alignItems: "center"}}>
              {params.value}
            </div>
          );
        },
        checkbox: true,
      },
      minWidth: 280,
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
  suppressMovable: true,
  lockPinned: true,
  lockPosition: "left",
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
  field: "button",
  pinned: "right",
  type: "ACTIONS",
  suppressMenu: true,
  lockPinned: true,
  suppressMovable: true,
  headerName: "Actions",
  suppressSizeToFit: true,
  suppressPaste: true,
  editable: false,
  cellRenderer: GridActionButtons,
  headerComponent: FieldCreateHeaderComponent,
};

export const updateObject = (tableSlug = "", data) => {
  constructorObjectService.update(tableSlug, {data: {...data}});
};
