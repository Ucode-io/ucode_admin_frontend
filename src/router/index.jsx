import React from "react";
import NewRouter from "./NewRouter";
import OldRouter from "./OldRouter";

function Router() {
  const routerSwitch = localStorage.getItem("new_router") || "";

  return (
    <>{Boolean(routerSwitch === "true") ? <NewRouter /> : <OldRouter />}</>
  );
}

export default Router;
