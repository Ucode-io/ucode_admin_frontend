import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import {useDropzone} from "react-dropzone";
import "./index.module.scss";
import RingLoader from "../../../Loaders/RingLoader";
import {useCallback, useRef} from "react";
import { GreyLoader } from "../../../Loaders/GreyLoader";

const FileUploadWithDraggable = ({ setData, loader, data }) => {
  const inputRef = useRef(null);

  const onDrop = useCallback((files) => {
    const file = files?.[0];
    const data = new FormData();
    data.append("file", file);

    setData(data);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="FileUploadWithDrag">
      <div
        {...getRootProps()}
        className="dropzone"
        ref={inputRef}
        style={{ height: 164 }}
      >
        <input {...getInputProps()} />
        {!loader ? (
          <>
            <MoveToInboxIcon className="dropzone-icon" />
            <p className="dropzone-title">Upload file</p>
            <p>{data?.get("file")?.name}</p>
          </>
        ) : (
          // <RingLoader />
          <GreyLoader size="40px" />
        )}
      </div>
    </div>
  );
};

export default FileUploadWithDraggable;
