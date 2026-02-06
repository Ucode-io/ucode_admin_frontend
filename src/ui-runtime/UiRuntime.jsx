import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutRenderer } from "./renderers/LayoutRenderer";
import { TablePage } from "./views/TablePage";

export function UiRuntime({ uiSpec }) {
  const defaultSlug = uiSpec?.navigation?.sidebar[0]?.slug;

  return (
      <Routes>
        <Route element={<LayoutRenderer uiSpec={uiSpec} />}>
          <Route
            path="/"
            element={defaultSlug ? <Navigate to={`/t/${defaultSlug}`} replace /> : <div>No pages</div>}
          />
          <Route path="/t/:tableSlug" element={<TablePage uiSpec={uiSpec} />} />
          <Route path="*" element={<div style={{ padding: 16 }}>Not found</div>} />
        </Route>
      </Routes>
  );
}
