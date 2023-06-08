import { Suspense } from "react";
import { lazy } from "react";
// import empty from "remote_empty_app/empty";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";

const empty = lazy(() => import('remote_empty_app/empty'));

const EMPTY = empty;

const MicrofrontendComponent = ({ link }) => {
  const RemoteButton = lazy(async () => {
    window.remotesMap[`remote_app_${link}`] = {
      url: link,
      format: "esm",
      from: "vite",
    };

    const comp = await window.__federation_method_getRemote(
      `remote_app_${link}`,
      "./Page"
    );
    return comp;
  });

  return (
    
    <Suspense fallback={<RingLoaderWithWrapper style={{ height: "100vh" }} />}>
      <RemoteButton text="Hello microfrontend" />
    </Suspense>
  );
};
export default MicrofrontendComponent;
