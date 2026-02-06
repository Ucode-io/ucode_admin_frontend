import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { TableView } from "./TableView";

export function TablePage({ uiSpec }) {
  const { tableSlug } = useParams();

  const table = useMemo(
    () => uiSpec.tables.find((t) => t.slug === tableSlug),
    [uiSpec.tables, tableSlug]
  );

  if (!table) return <div>Table not found</div>;

  // MVP: пустые данные (позже подключим backend list endpoint)
  const rows = [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{table.label}</div>
        <button
          style={{
            height: 36,
            padding: "0 12px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => alert("MVP: Create modal позже")}
        >
          Create
        </button>
      </div>

      <TableView table={table} rows={rows} />
    </div>
  );
}
