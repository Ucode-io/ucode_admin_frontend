import React, {useMemo, useState} from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {AgGridReact} from "ag-grid-react";
import {useParams} from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService";
import {useMutation, useQuery, useQueryClient} from "react-query";
import constructorTableService from "../../../services/constructorTableService";
import {ClientSideRowModelModule, ModuleRegistry} from "ag-grid-community";
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import getColumnEditorParams from "./valueOptionGenerator";
import constructorViewService from "../../../services/constructorViewService";
import {
  ClipboardModule,
  ColumnsToolPanelModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  MenuModule,
  RangeSelectionModule,
  ColumnsToolPanelModule,
  RowGroupingModule,
]);

function AgGridTableView({view}) {
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();
  const queryClient = useQueryClient();
  const [pinFields, setPinFields] = useState(view?.attributes?.pinnedFields);

  const [rowData, setRowData] = useState([]);
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 30, 40, 50];

  const customActions = {
    field: "actions",
    headerName: "Actions",
    cellRenderer: <Button>Action</Button>,
    cellRendererParams: {
      onClick: () => {
        console.log("ssssss");
      },
    },
  };

  const updateView = (pinnedField) => {
    setPinFields((prevState) => {
      const newPinnedFields = {...prevState};
      const fieldId = Object.keys(pinnedField)[0];
      const pinnedValue = pinnedField[fieldId]?.pinned;

      if (pinnedValue === null || pinnedValue === "") {
        delete newPinnedFields[fieldId];
      } else newPinnedFields[fieldId] = {pinned: pinnedValue};

      constructorViewService
        .update(tableSlug, {
          ...view,
          attributes: {
            ...view.attributes,
            pinnedFields: newPinnedFields,
          },
        })
        .then(() => {
          queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        });

      return newPinnedFields;
    });
  };

  const {data: {tableData} = {tableData: []}, isLoading: tableLoader} =
    useQuery(
      ["GET_OBJECTS_LIST_DATA", tableSlug, view],
      () =>
        constructorObjectService.getListV2(tableSlug, {
          data: {limit: 20, offset: 0},
        }),
      {
        enabled: !!tableSlug,
        select: (res) => ({tableData: res.data?.response ?? []}),
        onSuccess: (data) => setRowData(data.tableData),
      }
    );

  const {
    data: {fiedlsarray, fieldView, custom_events} = {
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
          const pinnedStatus = pinFields?.[item?.id]?.pinned ?? "";
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
        fieldView: res?.data?.views ?? [],
        custom_events: res?.data?.custom_events ?? [],
      };
    },
  });

  const {mutate: updateObject} = useMutation((data) =>
    constructorObjectService.update(tableSlug, {data: {...data}})
  );

  const defaultColDef = useMemo(
    () => ({
      width: 100,
      enableRowGroup: true,
      autoHeaderHeight: true,
    }),
    []
  );

  const autoGroupColumnDef = useMemo(() => ({minWidth: 200}), []);

  const rowSelection = useMemo(() => ({mode: "multiRow"}), []);

  const onColumnPinned = (event) => {
    const {column, pinned} = event;
    const fieldId = column?.colDef?.columnID;

    updateView({
      [fieldId]: {pinned},
    });
  };

  return (
    <div className="ag-theme-quartz" style={{height: "calc(100vh - 50px)"}}>
      <AgGridReact
        sideBar={false}
        rowData={rowData}
        pagination={true}
        cellSelection={true}
        suppressRefresh={true}
        columnDefs={fiedlsarray}
        rowSelection={rowSelection}
        rowGroupPanelShow={"always"}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        onCellValueChanged={(e) => updateObject(e.data)}
        onColumnPinned={onColumnPinned}
      />
    </div>
  );
}

export default AgGridTableView;
