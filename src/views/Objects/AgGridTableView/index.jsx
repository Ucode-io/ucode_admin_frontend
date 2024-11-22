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
import {ClientSideRowModelModule, ModuleRegistry} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnsToolPanelModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import {Button} from "@mui/material";

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
  const [rowData, setRowData] = useState([]);

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
            enableGrpupRow: true,
          };
          getColumnEditorParams(item, columnDef);

          return columnDef;
        }, customActions),
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

  const defaultColDef = useMemo(() => {
    return {
      width: 100,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
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

// import React, {useEffect, useMemo, useState} from "react";
// import styles from "./style.module.scss";
// import {AgGridReact} from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

// function AgGridTableView() {
//   const [rowData, setRowData] = useState([]);

//   useEffect(() => {
//     fetch("https://www.ag-grid.com/example-assets/space-mission-data.json")
//       .then((result) => result.json())
//       .then((rowData) => setRowData(rowData));
//   }, []);

//   const CompanyLogoRenderer = ({value}) => (
//     <span
//       style={{
//         display: "flex",
//         height: "100%",
//         width: "100%",
//         alignItems: "center",
//       }}>
//       {value && (
//         <img
//           alt={`${value} Flag`}
//           src={`https://www.ag-grid.com/example-assets/space-company-logos/${value.toLowerCase()}.png`}
//           style={{
//             display: "block",
//             width: "25px",
//             height: "auto",
//             maxHeight: "50%",
//             marginRight: "12px",
//             filter: "brightness(1.1)",
//           }}
//         />
//       )}
//       <p
//         style={{
//           textOverflow: "ellipsis",
//           overflow: "hidden",
//           whiteSpace: "nowrap",
//         }}>
//         {value}
//       </p>
//     </span>
//   );

//   const [colDefs, setColDefs] = useState([
//     {
//       field: "mission",
//       width: 150,
//       filter: true,
//       editable: true,
//     },
//     {
//       field: "company",
//       width: 130,
//       filter: true,
//       cellRenderer: CompanyLogoRenderer,
//       editable: true,
//     },
//     {
//       field: "location",
//       width: 225,
//       filter: true,
//     },
//     {
//       field: "date",
//       filter: true,
//       editable: true,
//       //   valueFormatter: dateFormatter,
//     },
//     {
//       field: "price",
//       filter: true,
//       editable: true,
//       width: 130,
//       valueFormatter: (params) => {
//         return "£" + params.value.toLocaleString();
//       },
//     },
//     {
//       field: "successful",
//       filter: true,
//       editable: true,
//       width: 120,
//       //   cellRenderer: MissionResultRenderer,
//     },
//     {field: "rocket", filter: true, editable: true},
//   ]);

//   const rowSelection = useMemo(() => {
//     return {
//       mode: "multiRow",
//     };
//   }, []);

//   const pagination = true;
//   const paginationPageSize = 500;
//   const paginationPageSizeSelector = [200, 500, 1000];

//   return (
//     <div className="ag-theme-quartz" style={{height: "calc(100vh - 50px)"}}>
//       <AgGridReact
//         columnDefs={colDefs}
//         rowData={rowData}
//         pagination={pagination}
//         paginationPageSize={paginationPageSize}
//         paginationPageSizeSelector={paginationPageSizeSelector}
//         rowSelection={rowSelection}
//       />
//     </div>
//   );
// }

// export default AgGridTableView;
