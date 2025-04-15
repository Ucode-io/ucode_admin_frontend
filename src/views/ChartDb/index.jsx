import React, {useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import {store} from "../../store";

const ChartDb = () => {
  const location = useLocation();

  const projectId = store.getState().company.projectId;
  const envId = store.getState().company?.environmentId;

  const iframeRef = useRef(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const sendDataToChartDB = () => {
    const data = {
      type: "UPDATE_DATA",
      payload: {
        projectID: projectId,
        envID: envId,
      },
    };

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        data,
        "http://localhost:5173"
      );
      console.log("✅ Data sent to iframe:", data);
    } else {
      console.warn("⚠️ Iframe not ready");
    }
  };

  useEffect(() => {
    const handleIframeReady = (event) => {
      if (
        event.origin === "http://localhost:5173" &&
        event.data?.type === "READY"
      ) {
        sendDataToChartDB();
      }
    };

    window.addEventListener("message", handleIframeReady);
    return () => window.removeEventListener("message", handleIframeReady);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="http://localhost:5173"
      width="100%"
      height="100%"
      onLoad={() => {
        setIsIframeLoaded(true);
      }}
      title="ChartDB"
    />
  );
};

export default ChartDb;
