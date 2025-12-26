import { Outlet } from "react-router-dom";
import { SidebarRenderer } from "./SidebarRenderer";

export function LayoutRenderer({ uiSpec }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f7f9" }}>
      {uiSpec?.layout?.sidebar && (
        <div style={{ width: 260, borderRight: "1px solid #e5e7eb", background: "#fff" }}>
          <SidebarRenderer uiSpec={uiSpec} />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {uiSpec?.layout?.header && (
          <div style={{ height: 56, background: "#fff", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", padding: "0 16px" }}>
            <div style={{ fontWeight: 600 }}>Ucode</div>
          </div>
        )}

        <div style={{ padding: 16, flex: 1 }}>
          <Outlet />
        </div>

        {uiSpec?.layout?.footer && (
          <div style={{ height: 48, background: "#fff", borderTop: "1px solid #e5e7eb" }} />
        )}
      </div>
    </div>
  );
}
