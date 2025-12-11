import React from "react";

export const DataList = ({ items }) => {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "12px 20px",
        width: "100%",
        fontFamily: "Inter, sans-serif"
      }}
    >
      {items.map((item, index) => (
        <div key={index} style={{ paddingTop: 8, paddingBottom: 8, display: "flex", justifyContent: "space-between", borderBottom: index !== items.length - 1 && "1px solid #f2f2f2" }}>
          <div
            style={{
              fontSize: 13,
              color: "#6b7280",
              marginBottom: 2
            }}
          >
            {item.label}
          </div>

          <div
            style={{
              fontSize: 14,
              color: "#6b7280",
              fontWeight: 600,
              wordBreak: "break-all",
              marginLeft: "auto",
              textAlign: "left",
              minWidth: "300px"
            }}
          >
            {item.value}
          </div>

          {index !== items.length - 1 && (
            <div
              style={{
                height: 1,
                background: "#f2f2f2",
                marginTop: 14
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
