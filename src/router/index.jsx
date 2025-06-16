import React, {useEffect, useState} from "react";
import NewRouter from "./NewRouter";
import OldRouter from "./OldRouter";

function Router() {
  const [routerSwitch, setRouterSwitch] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("new_router");
    setRouterSwitch(stored === "true");
  }, []);

  return <>{routerSwitch ? <NewRouter /> : <OldRouter />}</>;
}

export default Router;
