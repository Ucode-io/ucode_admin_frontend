import AddCircleOutlineIcon from "@mui/icons-material/Upload";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import * as tus from "tus-js-client";
import { CircularProgress } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import convertToKbytes from "../../utils/convertToKbytes";
import "./style.scss";

const VideoUpload = ({ value, onChange, className = "", disabled }) => {
  const inputRef = useRef(null);
  const { token } = useSelector((state) => state.auth);
  const [bytesTotal, setBytesTotal] = useState(0);
  const [bytesUploaded, setBytesUploaded] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const inputChangeHandler = (e) => {
    setIsUploading(true);
    onChange("");

    const file = e.target.files[0];

    // Create a new tus upload
    var upload = new tus.Upload(file, {
      endpoint: "https://test.api.admin.editorypress.uz/v1/upload-videos/", // api must changed despite on project
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${token}`, // token should be taken from project which is using
      },
      
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: function (error) {
        setIsUploading(false);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        setBytesTotal(bytesTotal);
        setBytesUploaded(bytesUploaded);
      },
      onSuccess: function () {
        setIsUploading(false);
        onChange(
          "https://test.cdn.editorypress.uz/videos-temp/" +
            upload.url.split("/")[5].split("+")[0]
        );
      },
    });

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    });
  };

  return (
    <div className={`Gallery video_wrapper ${className}`}>
      {value ? (
        <div className="video_block">
          <video height="150" controls>
            <source
              src={value}
              //   type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div onClick={() => onChange("")}>
            <CancelIcon />
          </div>
        </div>
      ) : (
        <div
          className="add-block block"
          onClick={() => {
            inputRef.current.click();
            console.log("fasdljfs");
          }}
        >
          <div className="add-icon">
            {isUploading ? (
              <CircularProgress />
            ) : (
              <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
            )}
          </div>

          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={inputChangeHandler}
            // disabled={disabled}
          />
        </div>
      )}
      {isUploading && (
        <div className="uploading_status">
          <div
            className="progress"
            percent={`${((bytesUploaded / bytesTotal) * 100).toFixed(2)}%`}
          >
            <div
              style={{ width: `${(bytesUploaded / bytesTotal) * 100}%` }}
            ></div>
          </div>
          <p>
            {`${convertToKbytes(bytesUploaded)}Mb / ${convertToKbytes(
              bytesTotal
            )}Mb`}
          </p>
        </div>
      )}
    </div>
  );
};


export default VideoUpload;
