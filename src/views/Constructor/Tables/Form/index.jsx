import React from "react";
import OldRouterTableSettings from "./OldRouterTableSettings";
import NewRouterTable from "./NewRouterTable";

function ConstructorTablesFormPage() {
  const new_router = Boolean(localStorage.getItem("new_router") === "true");
  return <>{new_router ? <NewRouterTable /> : <OldRouterTableSettings />}</>;
}

export default ConstructorTablesFormPage;
