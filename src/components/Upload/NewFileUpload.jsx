import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {Box, Button, Popover, Typography} from "@mui/material";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import fileService from "../../services/fileService";
import PdfCompiler from "./PdfCompiler";
import DownloadIcon from "@mui/icons-material/Download";
import useDownloader from "../../hooks/useDownloader";

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
  const {t} = useTranslation();
  const {download} = useDownloader();
  const [openModal, setOpenModal] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

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
      .finally(() => {
        setAnchorEl(null);
        setLoading(false);
      });
  };

  const deleteImage = (id) => {
    onChange(null);
    handleModalClose();
  };

  const closeButtonHandler = (e) => {
    e.stopPropagation();
    deleteImage();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const valueGenerate = (value, separator = "_") => {
    const splitted = value?.split(separator);
    if (splitted?.length > 2) {
      return splitted.slice(1, -1).join(separator);
    } else {
      return splitted?.[1];
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const downloadFile = (url) => {
    download({
      link: url,
      fileName: valueGenerate(value),
    });
  };

  return (
    <div
      className={`Gallery ${className}`}
      style={{cursor: disabled ? "not-allowed" : "pointer"}}>
      {value && (
        <>
          <Box
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            sx={{width: drawerDetail ? "330px" : "100%"}}
            className="uploadedFile">
            <Button
              id="file_upload"
              aria-describedby={id}
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
              {valueGenerate(value)}
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
                onClick={() => downloadFile(value)}>
                <DownloadIcon />
                Dowload
              </Button>
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "flex-start",
                  color: "#fff",
                }}
                onClick={(e) => closeButtonHandler(e)}>
                <DeleteIcon style={{width: "17px", height: "17px"}} />
                Remove Image
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
                  inputRef.current.click();
                }}>
                <ChangeCircleIcon />
                Change Image
              </Button>
            </Box>
            <input
              id="image_photo"
              type="file"
              style={{
                display: "none",
              }}
              accept=".jpg, .jpeg, .png, .gif"
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
            disabled={disabled}
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

      <PdfCompiler
        value={value}
        openModal={openModal}
        handleClick={handleClick}
        handleClose={handleModalClose}
        valueGenerate={valueGenerate}
      />
    </div>
  );
}
