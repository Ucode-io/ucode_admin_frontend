import { Suspense, lazy } from "react";
// import empty from "remote_empty_app/empty";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import SafeComponent from "../SafeComponent";
import { useTranslation } from "react-i18next";
import httpsRequest from "@/utils/httpsRequest";
import httpsRequestV2 from "@/utils/httpsRequestV2";

// const empty = lazy(() => import("remote_empty_app/empty"));

// const EMPTY = empty;

const MicrofrontendComponent = ({ link, loginAction }) => {
  const RemoteButton = lazy(async () => {
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
  });
  const { i18n } = useTranslation();
  return (
    <SafeComponent>
      <Suspense
        fallback={<RingLoaderWithWrapper style={{ height: "100vh" }} />}
      >
        <RemoteButton
          i18n={i18n}
          loginAction={loginAction}
          sharedHttpRequest={httpsRequest}
          sharedHttpRequestV2={httpsRequestV2}
        />
      </Suspense>
    </SafeComponent>
  );
};
export default MicrofrontendComponent;
