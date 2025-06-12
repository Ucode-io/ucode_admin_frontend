import React from "react";
import NewRouter from "./NewRouter";
import OldRouter from "./OldRouter";

function Router() {
  return <>{true ? <NewRouter /> : <OldRouter />}</>;
}

export default Router;
