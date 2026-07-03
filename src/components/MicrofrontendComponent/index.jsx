import { Suspense, lazy, useEffect, useMemo } from "react";
// import empty from "remote_empty_app/empty";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import SafeComponent from "../SafeComponent";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import httpsRequest from "@/utils/httpsRequest";
import httpsRequestV2 from "@/utils/httpsRequestV2";

// const empty = lazy(() => import("remote_empty_app/empty"));

// const EMPTY = empty;

const MicrofrontendComponent = ({ link, loginAction, activationKey }) => {
  const RemoteButton = useMemo(() => lazy(async () => {
    window.remotesMap = window.remotesMap || {};
    window.remotesMap[`remote_app_${link}`] = {
      url: link,
      format: "esm",
      from: "vite",
    };

    const comp = await window.__federation_method_getRemote(
      `remote_app_${link}`,
      "./Page",
    );
    return comp;
  }), [link]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("ucode:microfrontend:activate", {
        detail: {
          activationKey,
          link,
        },
      }),
    );
  }, [activationKey, link]);

  const environmentName = useSelector(
    (state) => state?.company?.environmentItem?.name,
  );

  const environment = useMemo(
    () =>
      environmentName?.toLowerCase() === "production"
        ? "production"
        : "staging",
    [environmentName],
  );

  const { i18n } = useTranslation();
  return (
    <SafeComponent>
      <Suspense
        fallback={<RingLoaderWithWrapper style={{ height: "100vh" }} />}
      >
        <RemoteButton
          key={activationKey}
          activationKey={activationKey}
          environment={environment}
          i18n={i18n}
          loginAction={loginAction}
          microfrontendActivationKey={activationKey}
          sharedHttpRequest={httpsRequest}
          sharedHttpRequestV2={httpsRequestV2}
        />
      </Suspense>
    </SafeComponent>
  );
};
export default MicrofrontendComponent;
