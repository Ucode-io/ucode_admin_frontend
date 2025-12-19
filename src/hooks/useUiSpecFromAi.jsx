import { useEffect, useState } from "react";
import { isUISpecV1 } from "../ui-runtime/validate";
import { store } from "../store";

export function useUiSpecFromAi(opts) {

  const [state, setState] = useState({
    status: "idle",
    uiSpec: null,
    error: null,
  });

  const authStore = store.getState().auth;
  const token = authStore.token;
  const resourceId = authStore.resourceId;
  const companyStore = store.getState().company;
  const environmentId = companyStore.environmentId;

  const config = {
    headers: {},
  }

  config.headers.Authorization = `Bearer ${token}`;
  config.headers["environment-id"] = environmentId;
  config.headers["resource-id"] = resourceId;
  config.headers["Content-Type"] = "application/json";

  let cancelled = false;

  async function run() {
    setState({ status: "loading", uiSpec: null, error: null });

    try {
      const resp = await fetch(opts.endpoint, {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify(opts.payload),
      });

      const json = await resp.json();

      // response shape: { data: { ui_spec } } OR { ui_spec }
      const uiSpec = json?.data?.ui_spec ?? json?.ui_spec;

      if (!isUISpecV1(uiSpec)) {
        throw new Error("Invalid UI Spec v1 from server");
      }

      if (!cancelled) {
        setState({ status: "ready", uiSpec, error: null });
      }
    } catch (e) {
      if (!cancelled) {
        setState({
          status: "error",
          uiSpec: null,
          error: e && typeof e === "object" && "message" in e
            ? String(e.message)
            : "Failed",
        });
      }
    }
  }

  useEffect(() => {
    return () => {
      cancelled = true;
    };
  }, [opts.endpoint, JSON.stringify(opts.payload)]);

  return {
    ...state,
    run,
  };
}
