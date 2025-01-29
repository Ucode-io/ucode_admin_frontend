import AddCircleOutlineIcon from "@mui/icons-material/Upload";
import {useEffect, useRef, useState} from "react";
import {CircularProgress, InputAdornment, Tooltip} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import "./style.scss";
import fileService from "../../services/fileService";
import {Lock} from "@mui/icons-material";

const VideoUpload = ({value, onChange, className = "", disabled, tabIndex}) => {
  const inputRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const listener = () => {
      if (!document.fullscreenElement && !videoRef.current?.paused) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }
    }

    document.addEventListener('fullscreenchange', listener);
    return () => document.removeEventListener('fullscreenchange', listener);
  }, [])

  const imageClickHandler = (index) => {
    setPreviewVisible(true);
  };

  const inputChangeHandler = (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);

    fileService
      .upload(data)
      .then((res) => {
        onChange(import.meta.env.VITE_CDN_BASE_URL + "ucode/" + res.filename);
      })
      .finally(() => setLoading(false));
  };

  const deleteImage = (id) => {
    onChange(null);
  };

  const closeButtonHandler = (e) => {
    e.stopPropagation();
    deleteImage();
  };

  return (
    <div className={`Gallery ${className}`}>
      {value && (
        <div className="block" onClick={() => imageClickHandler()}>
          <button
            className="close-btn"
            type="button"
            onClick={(e) => closeButtonHandler(e)}>
            <CancelIcon/>
          </button>
          <video ref={videoRef} src={value} className="img" onClick={async (ev) => {
            try {
              await ev.target.requestFullscreen();
              ev.target.play();
            } catch (err) {
              ev.target.play();
            }
          }}/>
        </div>
      )}

      {!value && (
        <div
          className="add-block block"
          id="video"
          onClick={() => inputRef.current.click()}
          style={
            disabled
              ? {
                background: "#c0c0c039",
              }
              : {
                background: "inherit",
                color: "inherit",
              }
          }>
          <div className="add-icon">
            {!loading ? (
              <>
                {disabled ? (
                  <Tooltip title="This field is disabled for this role!">
                    <InputAdornment position="start">
                      <Lock style={{fontSize: "20px"}}/>
                    </InputAdornment>
                  </Tooltip>
                ) : (
                  <AddCircleOutlineIcon style={{fontSize: "35px"}}/>
                )}
                {/* <p>Max size: 4 MB</p> */}
              </>
            ) : (
              <CircularProgress/>
            )}
          </div>

          <input
            id="video_add"
            type="file"
            className="hidden"
            ref={inputRef}
            tabIndex={tabIndex}
            autoFocus={tabIndex === 1}
            onChange={inputChangeHandler}
            disabled={disabled}
          />
        </div>
      )}

      {/* {previewVisible && (
        <ImageViewer
          src={[value]}
          currentIndex={0}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={() => setPreviewVisible(false)}
        />
      )} */}
    </div>
  );
};

export default VideoUpload;
