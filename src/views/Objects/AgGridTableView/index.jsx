import React, {useMemo, useState} from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {AgGridReact} from "ag-grid-react";
import {useParams} from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService";
import {useMutation, useQuery} from "react-query";
import constructorTableService from "../../../services/constructorTableService";
import {ClientSideRowModelModule, ModuleRegistry} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnsToolPanelModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import getColumnEditorParams from "./valueOptionGenerator";
import DataCellEditor from "./FieldRelationGenerator/DateCellEditor";

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

  const {data: {tableData} = {tableData: []}, isLoading: tableLoader} =
    useQuery(
      ["GET_OBJECTS_LIST_DATA", tableSlug, view],
      () => {
        return constructorObjectService.getListV2(tableSlug, {
          data: {
            limit: 20,
            offset: 0,
          },
        });
      },
      {
        enabled: !!tableSlug,
        select: (res) => {
          return {
            tableData: res.data?.response ?? [],
          };
        },
        onSuccess: (data) => {
          setRowData(data?.tableData);
        },
      }
    );

  const {
    data: {fiedlsarray, fieldView, custom_events} = {
      pageCount: 1,
      fiedlsarray: [],
      custom_events: [],
    },
  } = useQuery({
    queryKey: ["GET_TABLE_INFO", tableSlug],
    queryFn: () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {},
      });
    },
    enabled: Boolean(!!tableSlug),
    select: (res) => {
      return {
        fiedlsarray: res?.data?.fields?.map((item) => {
          const columnDef = {
            headerName:
              item?.attributes?.[`label_${i18n?.language}`] || item?.label,
            field: item?.slug,
            minWidth: 250,
            filter: item?.type !== "PASSWORD" ? true : false,
            // editable: Boolean(
            //   item?.disabled ||
            //     !!item?.attributes?.field_permission?.edit_permission
            // ),
          };
          getColumnEditorParams(item, columnDef);

          return columnDef;
        }, customActions),
        fieldView: res?.data?.views ?? [],
        custom_events: res?.data?.custom_events ?? [],
      };
    },
  });

  const {mutate: updateObject} = useMutation((data) =>
    constructorObjectService.update(tableSlug, {
      data: {...data},
    })
  );

  const defaultColDef = useMemo(() => {
    return {
      width: 100,
      enableRowGroup: true,
      autoHeaderHeight: true,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
    };
  }, []);

  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  return (
    <div className="ag-theme-quartz" style={{height: "calc(100vh - 50px)"}}>
      <AgGridReact
        sideBar={false}
        rowData={rowData}
        pagination={true}
        cellSelection={true}
        // suppressRefresh={true}
        columnDefs={fiedlsarray}
        rowSelection={rowSelection}
        rowGroupPanelShow={"always"}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        paginationPageSize={paginationPageSize}
        onCellValueChanged={(e) => {
          updateObject(e?.data);
        }}
        frameworkComponents={{
          customDateEditor: DataCellEditor,
        }}
        paginationPageSizeSelector={paginationPageSizeSelector}
      />
    </div>
  );
}

export default AgGridTableView;
