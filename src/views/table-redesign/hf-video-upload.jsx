import React, {useEffect, useRef, useState} from "react";
import {Button, CircularProgress, FormHelperText} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {Controller} from "react-hook-form";

import fileService from "../../services/fileService";
import "@/components/Upload/style.scss";
import "./style.scss";

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
            name={name}
            value={value}
            onChange={(val) => {
              onChange(val)
              isNewTableView && updateObject()
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
      )}
    ></Controller>
  );
};

const VideoUpload = ({value, onChange, className = "", disabled, tabIndex}) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const fileName = (value ?? "").split("#")[0].split("_")[1] ?? "";

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
    <div className={className} style={{ textAlign: "left" }}>
      {value && (
        <div style={{display: "flex", alignItems: "center", columnGap: 5}}>
          <div className="video-block">
            <button
              className="close-btn"
              type="button"
              onClick={(e) => closeButtonHandler(e)}>
              <CancelIcon/>
            </button>
            <video ref={videoRef} src={value} onClick={async (ev) => {
              try {
                await ev.target.requestFullscreen();
                ev.target.play();
              } catch (err) {
                ev.target.play();
              }
            }}/>
          </div>
          <div style={{fontSize: 10, color: "#747474", fontWeight: 500}}>{fileName}</div>
        </div>
      )}

      {!value &&
        <Button
          onClick={() => inputRef.current.click()}
          sx={{
            padding: 0,
            minWidth: 40,
            width: 40,
            height: 27,
          }}>
          <input
            id="video_add"
            type="file"
            hidden
            ref={inputRef}
            tabIndex={tabIndex}
            autoFocus={tabIndex === 1}
            onChange={inputChangeHandler}
            disabled={disabled}
          />
          {!loading && <img src="/img/file-docs.svg" alt="Upload" style={{width: 24, height: 24}}/>}
          {loading && <CircularProgress size={20} />}
        </Button>
      }
    </div>
  );
};
