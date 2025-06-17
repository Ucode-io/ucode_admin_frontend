import React, {useEffect, useState} from "react";
import NewRouter from "./NewRouter";
import OldRouter from "./OldRouter";

function Router() {
  const [routerSwitch, setRouterSwitch] = useState(false);

  useEffect(() => {
    const checkRouter = () => {
      const stored = localStorage.getItem("new_router");
      setRouterSwitch(stored === "true");
    };

    checkRouter();

    window.addEventListener("storageUpdate", checkRouter);

    return () => window.removeEventListener("storageUpdate", checkRouter);
  }, []);

  return <>{routerSwitch ? <NewRouter /> : <OldRouter />}</>;
}

export default Router;
