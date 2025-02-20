import React, {useEffect, useRef, useState} from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Popover,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {Controller} from "react-hook-form";

import "@/components/Upload/style.scss";
import "./style.scss";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import DownloadIcon from "@mui/icons-material/Download";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import fileService from "../../../../services/fileService";

export const HFVideoUpload = ({
  control,
  name,
  required,
  updateObject,
  isNewTableView = false,
  tabIndex,
  rules,
  disabledHelperText = false,
  disabled,
  drawerDetail = false,
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
            // error={get(formik.touched, name) && Boolean(get(formik.errors, name))}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: 5,
              width: drawerDetail ? "310px" : "100%",
              margin: drawerDetail ? "0 auto" : "0",
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
