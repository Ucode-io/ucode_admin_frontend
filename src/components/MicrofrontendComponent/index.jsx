import { Suspense } from "react";
import { useId } from "react";
import { lazy } from "react";
import empty from "remote_empty_app/empty";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";

const EMPTY = empty;

const MicrofrontendComponent = ({ link }) => {
  console.log("LINK ==>", link);

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
