import React from "react";
import NewRouterTableSettings from "./newRouterTableSettings";
import OldRouterTableSettings from "./OldRouterTableSettings";

function ConstructorTablesFormPage() {
  const new_router = Boolean(localStorage.getItem("new_router") === "true");
  return (
    <>{new_router ? <NewRouterTableSettings /> : <OldRouterTableSettings />}</>
  );
}

export default ConstructorTablesFormPage;
