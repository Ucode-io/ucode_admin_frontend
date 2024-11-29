import React, {useEffect, useMemo, useState} from "react";
import styles from "./style.module.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {AgGridReact} from "ag-grid-react";
import {useParams} from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService";
import {useQuery} from "react-query";
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

  const {
    data: {tableData} = {
      tableData: [],
    },
    refetch,
    isLoading: tableLoader,
  } = useQuery({
    queryKey: [
      "GET_OBJECTS_LIST",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return constructorObjectService.getListV2(tableSlug, {
        data: {
          limit: 20,
          offset: 0,
        },
      });
    },
    enabled: !!tableSlug,
    select: (res) => {
      return {
        tableData: res.data?.response ?? [],
      };
    },
  });

  const {
    data: {fiedlsarray, fieldView, custom_events} = {
      pageCount: 1,
      fiedlsarray: [],
      custom_events: [],
    },
  } = useQuery({
    queryKey: [
      "GET_TABLE_INFO",
      {
        tableSlug,
      },
    ],
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
            editable: Boolean(
              item?.disabled ||
                !!item?.attributes?.field_permission?.edit_permission
            ),
          };
          getColumnEditorParams(item, columnDef);

          return columnDef;
        }, customActions),
        fieldView: res?.data?.views ?? [],
        custom_events: res?.data?.custom_events ?? [],
      };
    },
  });

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

  const paginationPageSize = 500;
  const paginationPageSizeSelector = [200, 500, 1000];

  return (
    <div className="ag-theme-quartz" style={{height: "calc(100vh - 50px)"}}>
      <AgGridReact
        columnDefs={fiedlsarray}
        rowData={tableData}
        pagination={true}
        cellSelection={true}
        sideBar={true}
        defaultColDef={defaultColDef}
        rowGroupPanelShow={"always"}
        autoGroupColumnDef={autoGroupColumnDef}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        rowSelection={rowSelection}
        onCellValueChanged={(event) =>
          console.log(`New Cell Value: ${event.value}`, event)
        }
      />
    </div>
  );
}

export default AgGridTableView;
