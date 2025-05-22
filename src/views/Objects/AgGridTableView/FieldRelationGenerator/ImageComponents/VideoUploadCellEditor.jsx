import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import {Box, Button, CircularProgress, Popover} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import fileService from "../../../../../services/fileService";

const VideoUploadCellEditor = ({
  value,
  onChange = () => {},
  disabled = false,
  tabIndex = 0,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const fileName = (value ?? "").split("#")[0].split("_")[1] ?? "";

  useEffect(() => {
    const listener = () => {
      if (!document.fullscreenElement && !videoRef.current?.paused) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause();
      }
    };

    document.addEventListener("fullscreenchange", listener);
    return () => document.removeEventListener("fullscreenchange", listener);
  }, []);

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

  const closeButtonHandler = (e) => {
    e.stopPropagation();
    onChange(null);
    setAnchorEl(null);
  };

  return (
    <>
      <div
        className={className}
        style={{textAlign: "left"}}
        onClick={(ev) => {
          if (value) {
            setAnchorEl(ev.target);
          }
        }}>
        {value && (
          <div style={{display: "flex", alignItems: "center", columnGap: 5}}>
            <div className="video-block-grid">
              <video ref={videoRef} src={value} />
            </div>
            <div style={{fontSize: 10, color: "#747474", fontWeight: 500}}>
              {fileName}
            </div>
          </div>
        )}

        {!value && (
          <Button
            id="video_button_field"
            onClick={() => inputRef.current.click()}
            sx={{
              padding: 0,
              minWidth: 40,
              width: 40,
              height: 27,
            }}>
            {!loading && (
              <img
                src="/img/file-docs.svg"
                alt="Upload"
                style={{width: 24, height: 24}}
              />
            )}
            {loading && <CircularProgress size={20} />}
          </Button>
        )}
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
          }}>
          <Button
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "flex-start",
            }}
            onClick={async () => {
              try {
                await videoRef.current.requestFullscreen();
                videoRef.current.play();
              } catch (err) {
                videoRef.current.play();
              }
            }}>
            <OpenInFullIcon />
            Show full video
          </Button>

          <RectangleIconButton
            className="removeImg"
            onClick={closeButtonHandler}>
            <DeleteIcon
              style={{width: "17px", height: "17px", marginRight: "12px"}}
            />
            Remove video
          </RectangleIconButton>

          <Button
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "flex-start",
            }}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current.click();
            }}>
            <ChangeCircleIcon />
            Change Video
          </Button>
        </Box>
      </Popover>

      <input
        type="file"
        accept="
              .MP4 (H.264/AVC),
              .MP4,
              .MOV,
              .AVI,
              .MKV,
              .WMV,
              .FLV,
              .WebM,
              .MPEG,
              .MPEG-4"
        hidden
        ref={inputRef}
        tabIndex={tabIndex}
        autoFocus={tabIndex === 1}
        onChange={inputChangeHandler}
        disabled={disabled}
      />
    </>
  );
};

export default VideoUploadCellEditor;
