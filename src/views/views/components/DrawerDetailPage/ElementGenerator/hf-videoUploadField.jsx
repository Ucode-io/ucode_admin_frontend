import React, {useEffect, useRef, useState} from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Modal,
  Popover,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {Controller} from "react-hook-form";

import "@/components/Upload/style.scss";
import "./style.scss";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import DownloadIcon from "@mui/icons-material/Download";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import fileService from "@/services/fileService";
import useDownloader from "@/hooks/useDownloader";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import {Download} from "@mui/icons-material";

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
  control,
  name,
  required,
  isNewTableView = false,
  tabIndex,
  rules,
  disabledHelperText = false,
  disabled,
  drawerDetail = false,
  updateObject = () => {},
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <>
          <VideoUpload
            drawerDetail={drawerDetail}
            name={name}
            value={value}
            onChange={(val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            tabIndex={tabIndex}
            disabled={disabled}
            {...props}
          />
          {!disabledHelperText && error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </>
      )}></Controller>
  );
};

const VideoUpload = ({
  value,
  onChange,
  className = "",
  disabled,
  tabIndex,
  drawerDetail = false,
}) => {
  const {download} = useDownloader();
  const inputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const [degree, setDegree] = useState(0);
  const [imgScale, setImgScale] = useState(1);
  const [openFullImg, setOpenFullImg] = useState(false);
  const handleOpenVideo = () => setOpenFullImg(true);
  const handleCloseVideo = () => setOpenFullImg(false);
  const fileName = (value ?? "").split("#")[0].split("_")[1] ?? "";

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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

  const downloadVideo = (url) => {
    download({
      link: url,
      fileName: value?.split?.("_")?.[1] ?? "",
    });
  };

  return (
    <>
      <div
        className={className}
        style={{
          textAlign: "left",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onClick={(ev) => {
          if (value) {
            // setAnchorEl(ev.target);
            handleOpenVideo();
          }
        }}>
        {value && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: 5,
              width: drawerDetail ? "310px" : "100%",
              margin: drawerDetail ? "0 0 0 10px" : "0",
            }}>
            <div className="video-block">
              <video ref={videoRef} src={value} />
            </div>
            <div style={{fontSize: 10, color: "#747474", fontWeight: 500}}>
              {fileName}
            </div>
          </div>
        )}
        <Box sx={{width: drawerDetail ? "330px" : ""}}>
          {!value && (
            <Button
              id="video_button_field"
              disabled={disabled}
              onClick={() => inputRef.current.click()}
              sx={{
                padding: 0,
                minWidth: 40,
                width: 40,
                height: 27,
              }}>
              {!loading && (
                <img
                  src="/img/newUpload.svg"
                  alt="Upload"
                  style={{width: 22, height: 22}}
                />
              )}
              {loading && <CircularProgress size={20} />}
            </Button>
          )}
        </Box>
      </div>

      {/* <Popover
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
      </Popover> */}

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
              setAnchorEl(null);
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

      <input
        type="file"
        hidden
        ref={inputRef}
        tabIndex={tabIndex}
        autoFocus={tabIndex === 1}
        onChange={inputChangeHandler}
        disabled={disabled}
        accept=".mp4, .mov, .avi, .wmv, .flv, .mpeg, .mpg, .m4v, .webm, .mkv"
      />

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
            <video
              onClick={(e) => e.stopPropagation()}
              controls
              className="uploadedImage"
              style={{transform: `scale(${imgScale})`}}
              src={value}></video>
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
            onClick={(e) => {
              setAnchorEl(e.target);
            }}
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
