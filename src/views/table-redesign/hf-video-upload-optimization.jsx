import "@/components/Upload/style.scss";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Modal,
  Popover,
  Typography,
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import fileService from "../../services/fileService";
import "./style.scss";
import useDownloader from "../../hooks/useDownloader";
import {Download} from "@mui/icons-material";
import VideoPlayer from "./hf-videoplayer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "700px",
  minHeight: "400px",
  border: "0px solid #000",
  p: 4,
};

export const HFVideoUpload = ({
  tabIndex,
  disabledHelperText = false,
  disabled,
  row,
  field,
  handleChange,
  ...props
}) => {

  const [error] = useState({})

  const onChange = (value) => {
    handleChange({
      value,
      name: field?.slug,
      rowId: row?.guid
    })
  }

  return (
    <>
      <VideoUpload
        value={row?.[field?.slug]}
        onChange={(val) => {
          onChange(val);
        }}
        tabIndex={tabIndex}
        disabled={disabled}
        {...props}
      />
      {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )}
    </>
  );
};

const VideoUpload = ({value, onChange, className = "", disabled, tabIndex}) => {
  const {download} = useDownloader();
  const inputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const fileName = (value ?? "").split("#")[0].split("_")[1] ?? "";
  const [openFullImg, setOpenFullImg] = useState(false);
  const handleOpenVideo = () => setOpenFullImg(true);
  const handleCloseVideo = () => setOpenFullImg(false);
  const [degree, setDegree] = useState(0);
  const [imgScale, setImgScale] = useState(1);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const imageZoom = (type) => {
    if (type === "down") {
      if (imgScale === 1) {
        setImgScale(1);
      } else {
        setImgScale(imgScale - 0.5);
      }
    } else if (type === "up") {
      if (imgScale === 4) {
        setImgScale(imgScale);
      } else {
        setImgScale(imgScale + 0.5);
      }
    }
  };

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

  const downloadVideo = (url) => {
    download({
      link: url,
      fileName: value?.split?.("_")?.[1] ?? "",
    });
  };

  return (
    <>
      <div className={className} style={{textAlign: "left"}}>
        {value && (
          <div
            onClick={() => handleOpenVideo()}
            style={{display: "flex", alignItems: "center", columnGap: 5}}>
            <div className="video-block">
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
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
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
            backgroundColor: "#212B36",
          }}>
          <Button
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "flex-start",
              color: "#fff",
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
            Show Full Video
          </Button>

          <Button
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "flex-start",
              color: "#fff",
            }}
            onClick={closeButtonHandler}>
            <DeleteIcon style={{width: "17px", height: "17px"}} />
            Remove Video
          </Button>

          <Button
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "flex-start",
              color: "#fff",
            }}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              inputRef.current.click();
            }}>
            <ChangeCircleIcon />
            Change Video
          </Button>
        </Box>
        <input
          type="file"
          hidden
          ref={inputRef}
          tabIndex={tabIndex}
          autoFocus={tabIndex === 1}
          onChange={inputChangeHandler}
          disabled={disabled}
        />
      </Popover>
      <Modal open={openFullImg} onClose={handleCloseVideo}>
        <Box
          sx={{
            ...style,
            outline: "none",
            boxShadow: "none",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            "&:focus-visible": {
              outline: "none",
              boxShadow: "none",
            },
          }}>
          <Box
            onClick={handleCloseVideo}
            sx={{
              border: "0px solid #fff",
              transform: `rotate(${degree}deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
            aria-describedby={id}>
            {value?.includes("m3u8") ? (
              <VideoPlayer
                videoRef={videoRef}
                controls
                style={{transform: `scale(${imgScale})`}}
                src={value}
              />
            ) : (
              <video
                onClick={(e) => e.stopPropagation()}
                controls
                className="uploadedImage"
                style={{transform: `scale(${imgScale})`}}
                src={value}></video>
            )}
            <Typography
              sx={{
                fontSize: "10px",
                color: "#747474",
              }}>
              {value?.split?.("_")?.[1] ?? ""}
            </Typography>
          </Box>
          <Button
            onClick={handleCloseVideo}
            sx={{
              position: "absolute",
              right: "-300px",
              top: "-50px",
              color: "white",
            }}>
            <ClearIcon style={{width: "30px", height: "30px"}} />
          </Button>
          <Button
            onClick={() => {
              imageZoom("up");
            }}
            sx={{
              position: "absolute",
              right: "-60px",
              bottom: "-30px",
              color: "#eee",
            }}>
            <ZoomInIcon style={{width: "30px", height: "30px"}} />
          </Button>
          <Button
            onClick={() => {
              imageZoom("down");
            }}
            sx={{
              position: "absolute",
              right: "-120px",
              bottom: "-30px",
              color: "#eee",
            }}>
            <ZoomOutIcon style={{width: "30px", height: "30px"}} />
          </Button>
          <Button
            onClick={() => {
              downloadVideo(value);
            }}
            sx={{
              position: "absolute",
              right: "-200px",
              bottom: "-30px",
              color: "#eee",
            }}>
            <Download style={{width: "30px", height: "30px"}} />
          </Button>{" "}
          <Button
            onClick={handleClick}
            sx={{
              position: "absolute",
              right: "-300px",
              bottom: "-30px",
              color: "#eee",
            }}>
            <MoreHorizIcon
              htmlColor="#fff"
              style={{width: "30px", height: "30px"}}
            />
          </Button>
        </Box>
      </Modal>

      <input
        type="file"
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
