import React, {useEffect, useState} from "react";
import NewRouter from "./NewRouter";
import OldRouter from "./OldRouter";

function Router({ resetQueryClient }) {
  const [routerSwitch, setRouterSwitch] = useState(null);

  useEffect(() => {
    const checkRouter = () => {
      const stored = localStorage.getItem("new_router");
      setRouterSwitch(stored === "true");
    };

    checkRouter();

    window.addEventListener("storageUpdate", checkRouter);

    return () => window.removeEventListener("storageUpdate", checkRouter);
  }, []);

  if (routerSwitch === null) {
    return <>Loading...</>;
  }

  return (
    <>
      {!!routerSwitch ? (
        <NewRouter resetQueryClient={resetQueryClient} />
      ) : (
        <OldRouter resetQueryClient={resetQueryClient} />
      )}
    </>
  );
}

export default Router;
