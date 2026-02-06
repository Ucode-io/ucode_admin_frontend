function humanize(s) {
  return s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function TableView({
  table,
  rows,
}) {
  const keys = Object.keys(table.attributes);

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
          <thead>
            <tr>
              {keys.map((k) => (
                <th
                  key={k}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderBottom: "1px solid #e5e7eb",
                    fontSize: 12,
                    color: "#6b7280",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {humanize(k)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={keys.length} style={{ padding: 16, color: "#6b7280" }}>
                  No rows yet (MVP). Next step: connect list endpoint.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx}>
                  {keys.map((k) => (
                    <td
                      key={k}
                      style={{
                        padding: "10px 12px",
                        borderBottom: "1px solid #f3f4f6",
                        fontSize: 14,
                        color: "#111827",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {String(r?.[k] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
