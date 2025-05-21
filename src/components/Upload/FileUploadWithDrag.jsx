import {useCallback, useRef} from "react";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import {useDropzone} from "react-dropzone";
import "./style.scss";
import RingLoader from "../Loaders/RingLoader";
import { GreyLoader } from "../Loaders/GreyLoader";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/alert/alert.thunk";

const FileUploadWithDrag = ({ onUpload, loader, maxSizeMB = 20 }) => {
  const inputRef = useRef(null);

  const dispatch = useDispatch();

  const onDrop = useCallback((files) => {
    const file = files[0];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      dispatch(showAlert(`Файл слишком большой. Максимум ${maxSizeMB} MB`));
      return;
    }

    const data = new FormData();
    data.append("file", file);

    onUpload(data);
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
          </>
        ) : (
          // <RingLoader />
          <GreyLoader size="40px" />
        )}
      </div>
    </div>
  );
};

export default FileUploadWithDrag;
