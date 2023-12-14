import { Switch } from "@mui/material";
import React, { useEffect } from "react";
import { columnIcons } from "../../../../utils/constants/columnIcons";

export default function SearchParams({
  checkedColumns,
  setCheckedColumns,
  columns,
}) {
  const changeHandler = (slug) => {
    if (checkedColumns.includes(slug)) {
      setCheckedColumns(checkedColumns.filter((el) => el !== slug));
    } else {
      setCheckedColumns([...checkedColumns, slug]);
    }
  };
  const selectAll = () => {
    setCheckedColumns(columns.map((el) => el.slug));
  };

  const deselectAll = () => {
    setCheckedColumns([]);
  };

  useEffect(() => {
    selectAll();
  }, []);
  return (
    <div>
      <div
        style={{
          padding: "10px 14px",
          minWidth: "200px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            padding: "6px 0",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ textAlign: "end" }}>All</div>
          </div>

          <div>
            <Switch
              size="small"
              onChange={() =>
                checkedColumns.length === columns.length
                  ? deselectAll()
                  : selectAll()
              }
              checked={checkedColumns.length === columns.length ? true : false}
            />
          </div>
        </div>

        {columns.map((column, index) => (
          <div
            key={column.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 0",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div>{columnIcons(column.type)}</div>

              <div style={{ textAlign: "end" }}>{column.label}</div>
            </div>

            <div>
              <Switch
                size="small"
                onChange={() => changeHandler(column.slug)}
                checked={checkedColumns.includes(column.slug)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
