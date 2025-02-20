import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {Box, Button, Popover, Typography} from "@mui/material";
import React, {useRef, useState} from "react";
import fileService from "../../services/fileService";

export default function NewFileUpload({
  value,
  onChange,
  className = "",
  disabled,
  tabIndex,
  field,
  drawerDetail = false,
}) {
  const inputRef = useRef("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const imageClickHandler = (index) => {
    setPreviewVisible(true);
  };

  const inputChangeHandler = (e) => {
    setLoading(true);

    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);

    fileService
      .folderUpload(data, {
        folder_name: field?.attributes?.path,
      })
      .then((res) => {
        onChange(import.meta.env.VITE_CDN_BASE_URL + res?.link);
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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className={`Gallery ${className}`}>
      {value && (
        <>
          <Box sx={{}} className="uploadedFile">
            <Button
              id="file_upload"
              aria-describedby={id}
              onClick={handleClick}
              sx={{
                padding: 0,
                minWidth: 40,
                width: 40,
                height: 27,
              }}>
              <AttachFileIcon
                style={{
                  color: "#747474",
                  fontSize: "25px",
                }}
              />
            </Button>

            <Typography
              sx={{
                fontSize: "10px",
                color: "#747474",
              }}>
              {value?.split?.("_")?.[1] ?? ""}
            </Typography>
          </Box>

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
              }}>
              <Button
                href={value}
                className=""
                download
                target="_blank"
                rel="noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "flex-start",
                }}>
                <OpenInFullIcon />
                Show file
              </Button>
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "flex-start",
                }}
                disabled={disabled}
                onClick={(e) => closeButtonHandler(e)}>
                <DeleteIcon />
                Remove file
              </Button>
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
                Change file
              </Button>
            </Box>
            <input
              id="fileUpload_field"
              type="file"
              style={{
                display: "none",
              }}
              className="hidden"
              ref={inputRef}
              tabIndex={tabIndex}
              autoFocus={tabIndex === 1}
              onChange={inputChangeHandler}
              disabled={disabled}
            />
          </Popover>
        </>
      )}

      <Box
        sx={{
          padding: drawerDetail ? "0 0px" : 0,
          width: "40px",
          display: "flex",
          alignItems: "center",
        }}>
        {!value && (
          <Button
            id="file_upload_btn"
            onClick={() => inputRef.current.click()}
            sx={{
              padding: 0,
              minWidth: 40,
              width: 40,
              height: 27,
            }}>
            <input
              id="file_upload"
              type="file"
              className="hidden"
              ref={inputRef}
              tabIndex={tabIndex}
              autoFocus={tabIndex === 1}
              onChange={inputChangeHandler}
              disabled={disabled}
            />
            <img
              src="/img/newUpload.svg"
              alt="Upload"
              style={{width: 22, height: 22}}
            />
          </Button>
        )}
      </Box>
    </div>
  );
}
