import React, {useEffect, useMemo, useState} from "react";
import styles from "./style.module.scss";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

function AgGridTableView() {
  const [rowData, setRowData] = useState([]);

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

  const [colDefs, setColDefs] = useState([
    {
      field: "mission",
      width: 150,
      filter: true,
      editable: true,
    },
    {
      field: "company",
      width: 130,
      filter: true,
      cellRenderer: CompanyLogoRenderer,
      editable: true,
    },
    {
      field: "location",
      width: 225,
      filter: true,
    },
    {
      field: "date",
      filter: true,
      editable: true,
      //   valueFormatter: dateFormatter,
    },
    {
      field: "price",
      filter: true,
      editable: true,
      width: 130,
      valueFormatter: (params) => {
        return "£" + params.value.toLocaleString();
      },
    },
    {
      field: "successful",
      filter: true,
      editable: true,
      width: 120,
      //   cellRenderer: MissionResultRenderer,
    },
    {field: "rocket", filter: true, editable: true},
  ]);

  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  const pagination = true;
  const paginationPageSize = 500;
  const paginationPageSizeSelector = [200, 500, 1000];

  return (
    <div className="ag-theme-quartz" style={{height: "calc(100vh - 50px)"}}>
      <AgGridReact
        columnDefs={colDefs}
        rowData={rowData}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        rowSelection={rowSelection}
      />
    </div>
  );
}

export default AgGridTableView;
