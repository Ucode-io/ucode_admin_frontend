import constructorObjectService from "../../../services/constructorObjectService";
import constructorTableService from "../../../services/constructorTableService";
import constructorViewService from "../../../services/constructorViewService";
import {ClientSideRowModelModule, ModuleRegistry} from "ag-grid-community";
import {useMutation, useQuery, useQueryClient} from "react-query";
import React, {useEffect, useMemo, useRef, useState} from "react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-grid.css";
import {AgGridReact} from "ag-grid-react";
import {useParams} from "react-router-dom";
import {
  ClipboardModule,
  ColumnsToolPanelModule,
  MenuModule,
  RangeSelectionModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  MenuModule,
  RangeSelectionModule,
  ColumnsToolPanelModule,
]);

function AgGridTableView({view}) {
  const {tableSlug} = useParams();
  const queryClient = useQueryClient();
  const [rowData, setRowData] = useState([]);
  const pinFieldsRef = useRef({});
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 30, 40, 50];

  const {mutate: updateObject} = useMutation((data) =>
    constructorObjectService.update(tableSlug, {data: {...data}})
  );

  const {data: {tableData} = {tableData: []}, isLoading: tableLoader} =
    useQuery(
      ["GET_OBJECTS_LIST_DATA", tableSlug],
      () =>
        constructorObjectService.getListV2(tableSlug, {
          data: {limit: 20, offset: 0},
        }),
      {
        enabled: !!tableSlug,
        onSuccess: (data) => setRowData(data?.data?.response ?? []),
      }
    );

  const {data: {fiedlsarray = []} = {}} = useQuery({
    queryKey: ["GET_TABLE_INFO", tableSlug, view],
    queryFn: () => constructorTableService.getTableInfo(tableSlug, {data: {}}),
    enabled: Boolean(tableSlug),
    select: (res) => {
      const fields = res?.data?.fields?.map((item) => {
        const pinnedStatus =
          pinFieldsRef.current?.[item.id]?.pinned ??
          view?.attributes?.pinnedFields?.[item.id]?.pinned ??
          "";

        return {
          headerName: item?.label || item?.attributes?.label_en,
          field: item?.slug,
          pinned: pinnedStatus,
          columnID: item?.id,
          editable: true,
        };
      });
      return {fiedlsarray: fields};
    },
  });

  const defaultColDef = useMemo(
    () => ({width: 200, autoHeaderHeight: true}),
    []
  );

  const autoGroupColumnDef = useMemo(() => ({minWidth: 200}), []);

  const rowSelection = useMemo(() => ({mode: "multiRow"}), []);

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
    <div className="ag-theme-quartz" style={{height: "calc(100vh - 50px)"}}>
      <AgGridReact
        AgGridReact
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

// import React, {useEffect, useMemo, useRef, useState} from "react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import {AgGridReact} from "ag-grid-react";
// import {useParams} from "react-router-dom";
// import constructorObjectService from "../../../services/constructorObjectService";
// import {useMutation, useQuery, useQueryClient} from "react-query";
// import constructorTableService from "../../../services/constructorTableService";
// import {ClientSideRowModelModule, ModuleRegistry} from "ag-grid-community";
// import {Button} from "@mui/material";
// import {useTranslation} from "react-i18next";
// import getColumnEditorParams from "./valueOptionGenerator";
// import constructorViewService from "../../../services/constructorViewService";
// import {
//   ClipboardModule,
//   ColumnsToolPanelModule,
//   MenuModule,
//   RangeSelectionModule,
//   RowGroupingModule,
// } from "ag-grid-enterprise";

// ModuleRegistry.registerModules([
//   ClientSideRowModelModule,
//   ClipboardModule,
//   MenuModule,
//   RangeSelectionModule,
//   ColumnsToolPanelModule,
//   // RowGroupingModule,
// ]);

// function AgGridTableView({view}) {
//   const {tableSlug} = useParams();
//   const {i18n} = useTranslation();
//   const queryClient = useQueryClient();
//   const [rowData, setRowData] = useState([]);
//   const paginationPageSize = 10;
//   const paginationPageSizeSelector = [10, 20, 30, 40, 50];

//   const pinFieldsRef = useRef({});

//   const updateView = (pinnedField) => {
//     pinFieldsRef.current = {...pinFieldsRef.current, ...pinnedField};

//     const newPinnedFields = pinFieldsRef.current;

//     constructorViewService.update(tableSlug, {
//       ...view,
//       attributes: {
//         ...view.attributes,
//         pinnedFields: newPinnedFields,
//       },
//     });
//   };

//   const {data: {tableData} = {tableData: []}, isLoading: tableLoader} =
//     useQuery(
//       ["GET_OBJECTS_LIST_DATA", tableSlug, view],
//       () =>
//         constructorObjectService.getListV2(tableSlug, {
//           data: {limit: 20, offset: 0},
//         }),
//       {
//         enabled: !!tableSlug,
//         select: (res) => ({tableData: res.data?.response ?? []}),
//         onSuccess: (data) => setRowData(data.tableData),
//       }
//     );

//   const {
//     data: {fiedlsarray, fieldView, custom_events} = {
//       pageCount: 1,
//       fiedlsarray: [],
//       custom_events: [],
//     },
//   } = useQuery({
//     queryKey: ["GET_TABLE_INFO", tableSlug, view],
//     queryFn: () => constructorTableService.getTableInfo(tableSlug, {data: {}}),
//     enabled: Boolean(tableSlug),
//     select: (res) => {
//       return {
//         fiedlsarray: res?.data?.fields?.map((item) => {
//           const pinnedStatus =
//             view?.attributes?.pinnedFields?.[item?.id]?.pinned ?? "";
//           const columnDef = {
//             headerName:
//               item?.attributes?.[`label_${i18n?.language}`] || item?.label,
//             field: item?.slug,
//             minWidth: 250,
//             filter: item?.type !== "PASSWORD",
//             view,
//             columnID: item?.id,
//             pinned: pinnedStatus,
//             editable: Boolean(
//               item?.disabled ||
//                 !!item?.attributes?.field_permission?.edit_permission
//             ),
//           };
//           getColumnEditorParams(item, columnDef);
//           return columnDef;
//         }),
//         fieldView: res?.data?.views ?? [],
//         custom_events: res?.data?.custom_events ?? [],
//       };
//     },
//   });

//   const {mutate: updateObject} = useMutation((data) =>
//     constructorObjectService.update(tableSlug, {data: {...data}})
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       width: 100,
//       // enableRowGroup: true,
//       autoHeaderHeight: true,
//     }),
//     []
//   );

//   const autoGroupColumnDef = useMemo(() => ({minWidth: 200}), []);

//   const rowSelection = useMemo(() => ({mode: "multiRow"}), []);

//   const onColumnPinned = (event) => {
//     const {column, pinned} = event;
//     const fieldId = column?.colDef?.columnID;

//     updateView({
//       [fieldId]: {pinned},
//     });
//   };

//   useEffect(() => {
//     pinFieldsRef.current = view?.attributes?.pinnedFields;
//   }, [view?.attributes?.pinnedFields]);

//   return (
//     <div className="ag-theme-quartz" style={{height: "calc(100vh - 50px)"}}>
//       <AgGridReact
//         sideBar={false}
//         rowData={rowData}
//         pagination={true}
//         cellSelection={true}
//         suppressRefresh={true}
//         columnDefs={fiedlsarray}
//         rowSelection={rowSelection}
//         rowGroupPanelShow={"always"}
//         defaultColDef={defaultColDef}
//         autoGroupColumnDef={autoGroupColumnDef}
//         paginationPageSize={paginationPageSize}
//         paginationPageSizeSelector={paginationPageSizeSelector}
//         onCellValueChanged={(e) => updateObject(e.data)}
//         onColumnPinned={onColumnPinned}
//       />
//     </div>
//   );
// }

// export default AgGridTableView;
