import { Worker, Viewer as PDFViewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";
import "./index.scss";

const Viewer = ({ url }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  console.log({ workerUrl });
  return (
    <Worker workerUrl={workerUrl}>
      <div style={{ height: "calc(100vh - 130px)" }} className="PDF-viewer">
        <PDFViewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
      </div>
    </Worker>
  );
};

export default Viewer;
