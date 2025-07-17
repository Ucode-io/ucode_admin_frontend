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
  InputAdornment,
  Modal,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import {useRef, useState} from "react";
import fileService from "../../../../../services/fileService";
import styles from "../style.module.scss";
import DownloadIcon from "@mui/icons-material/Download";
import useDownloader from "../../../../../hooks/useDownloader";

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

const VideoUploadCellEditor = ({
  value,
  onChange = () => {},
  disabled = false,
  tabIndex = 0,
}) => {
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const {download} = useDownloader();
  const fileName = (value ?? "").split("#")[0].split("_")[1] ?? "";
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFullImg, setOpenFullImg] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [degree, setDegree] = useState(0);
  const [imgScale, setImgScale] = useState(1);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleOpenVideo = () => {
    setOpenFullImg(true);
  };

  const handleCloseVideo = () => {
    setOpenFullImg(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

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

  const deleteImage = () => {
    onChange("");
    handleCloseVideo();
    handleClose();
  };

  const closeButtonHandler = (e) => {
    e.stopPropagation();
    deleteImage();
  };

  const downloadVideo = (url) => {
    download({
      link: url,
      fileName: value?.split?.("_")?.[1] ?? "",
    });
  };

  return (
    <>
      {" "}
      <Box
        className={styles.Gallery}
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          alignItems: "center",
          paddingLeft: "10px",
        }}>
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
          <div
            className="add-block block"
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
            <div className={styles.addIcon}>
              {!loading ? (
                <>
                  {disabled ? (
                    <Tooltip title="This field is disabled for this role!">
                      <InputAdornment position="start">
                        <img src="/table-icons/lock.svg" alt="lock" />
                      </InputAdornment>
                    </Tooltip>
                  ) : (
                    <img
                      src="/img/file-docs.svg"
                      alt="Upload"
                      style={{width: 24, height: 24}}
                    />
                  )}
                </>
              ) : (
                <CircularProgress style={{width: "22px", height: "22px"}} />
              )}
            </div>
          </div>
        )}
      </Box>
      <input
        type="file"
        accept="video/*"
        className="hidden-element"
        ref={inputRef}
        tabIndex={tabIndex}
        autoFocus={tabIndex === 1}
        onChange={inputChangeHandler}
        disabled={disabled}
      />
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
      </Popover>
      <Modal open={openFullImg} onClose={handleCloseVideo}>
        <Box sx={style}>
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
            <video
              onClick={(e) => e.stopPropagation()}
              ref={videoRef}
              autoPlay={false}
              controls
              className="uploadedImage"
              style={{
                transform: `scale(${imgScale})`,
                position: "relative",
                zIndex: 2,
              }}
              src={value}
            />
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
              right: "-90px",
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
              right: "-150px",
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
              right: "-220px",
              bottom: "-30px",
              color: "#eee",
            }}>
            <DownloadIcon style={{width: "30px", height: "30px"}} />
          </Button>

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
    </>
  );
};

export default VideoUploadCellEditor;
