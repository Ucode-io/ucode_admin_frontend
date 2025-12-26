import { NavLink } from "react-router-dom";

function itemStyle(isActive) {
  return {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "10px 12px",
    margin: "4px 8px",
    borderRadius: 10,
    textDecoration: "none",
    color: isActive ? "#111827" : "#374151",
    background: isActive ? "#eef2ff" : "transparent",
    border: "1px solid " + (isActive ? "#c7d2fe" : "transparent"),
  };
}


export function SidebarRenderer({ uiSpec }) {
  return (
    <div style={{ padding: 12 }}>
      <div
        style={{
          fontWeight: 700,
          padding: "8px 10px",
          color: "#111827",
        }}
      >
        Navigation
      </div>

      {uiSpec?.navigation?.sidebar?.map((item) => (
        <NavLink
          key={item.slug}
          to={`/t/${item.slug}`}
          style={({ isActive }) => itemStyle(isActive)}
        >
          <span
            style={{
              width: 18,
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            {item.icon?.slice(0, 1)?.toUpperCase()}
          </span>

          <span style={{ fontSize: 14, fontWeight: 600 }}>
            {item.label}
          </span>
        </NavLink>
      ))}
    </div>
  );
}
