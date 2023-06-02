import { Suspense } from "react";
import { useId } from "react";
import { lazy } from "react";
import empty from "remote_empty_app/empty";

const EMPTY = empty;

const MicrofrontendComponent = () => {
  const id = useId();

  const RemoteButton = lazy(async () => {
    window.remotesMap[`remote_app_${id}`] = {
      url: "http://localhost:6003/assets/remoteEntry.js",
      format: "esm",
      from: "vite",
    };

    const comp = await window.__federation_method_getRemote(
      `remote_app_${id}`,
      "./Page"
    );
    return comp;
  });
  
  return (
    <Suspense fallback={() => "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"}>
      <div>
        asdasd
        <RemoteButton text="Hello microfrontend" />
      </div>
    </Suspense>
  );
};
export default MicrofrontendComponent;
