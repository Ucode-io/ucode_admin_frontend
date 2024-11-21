import React, {useEffect, useMemo, useState} from "react";
import styles from "./style.module.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {AgGridReact} from "ag-grid-react";
import {useParams} from "react-router-dom";
import constructorObjectService from "../../../services/constructorObjectService";
import {useQuery} from "react-query";
import constructorTableService from "../../../services/constructorTableService";
import getColumnEditorParams from "./valueOptionGenerator";

function AgGridTableView({view}) {
  const {tableSlug} = useParams();
  const [rowData, setRowData] = useState([]);

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
            field: item?.slug,
            minWidth: 250,
            filter: true,
            editable: true,
          };
          getColumnEditorParams(item, columnDef);

          return columnDef;
        }),
        fieldView: res?.data?.views ?? [],
        custom_events: res?.data?.custom_events ?? [],
      };
    },
  });

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

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/space-mission-data.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  const CompanyLogoRenderer = ({value}) => (
    <span
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
      }}>
      {value && (
        <img
          alt={`${value} Flag`}
          src={`https://www.ag-grid.com/example-assets/space-company-logos/${value.toLowerCase()}.png`}
          style={{
            display: "block",
            width: "25px",
            height: "auto",
            maxHeight: "50%",
            marginRight: "12px",
            filter: "brightness(1.1)",
          }}
        />
      )}
      <p
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}>
        {value}
      </p>
    </span>
  );

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
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        rowSelection={rowSelection}
      />
    </div>
  );
}

export default AgGridTableView;
