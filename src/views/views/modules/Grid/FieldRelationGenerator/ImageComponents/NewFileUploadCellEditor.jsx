import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {Box, Button, Popover, Typography} from "@mui/material";
import React, {useRef, useState} from "react";
import fileService from "@/services/fileService";
import PdfCompiler from "@/components/Upload/PdfCompiler";
import useDownloader from "@/hooks/useDownloader";
import DownloadIcon from "@mui/icons-material/Download";

export default function NewFileUploadCellEditor({
  value,
  onChange = () => {},
  className = "",
  disabled = false,
  tabIndex = 0,
  field = {},
}) {
  const {download} = useDownloader();
  const [openModal, setOpenModal] = useState(false);
  const inputRef = useRef("");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const inputChangeHandler = (e) => {

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
      });
  };

  const deleteImage = () => {
    onChange(null);
  };

  const closeButtonHandler = (e) => {
    e.stopPropagation();
    deleteImage();
    handleModalClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const valueGenerate = (value, separator = "_") => {
    const splitted = value?.split(separator);
    if (splitted?.length > 2) {
      return splitted.slice(1, -1).join(separator);
    } else {
      return splitted?.[1];
    }
  };

  const downloadFile = (url) => {
    download({
      link: url,
      fileName: valueGenerate(value),
    });
  };
  return (
    <>
      <Box
        className={`Gallery ${className}`}
        sx={{
          position: "absolute",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
          paddingLeft: "10px",
          display: "flex",
          alignItems: "center",
        }}>
        {value && (
          <>
            <Box
              onClick={() => {
                !disabled && handleOpen();
              }}
              className="uploadedFile">
              <Button
                aria-describedby={id}
                sx={{
                  padding: 0,
                  minWidth: "25px",
                  width: "25px",
                  height: "25px",
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
                  onClick={(e) => closeButtonHandler(e)}>
                  <DeleteIcon style={{width: "17px", height: "17px"}} />
                  Remove File
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
                  Change File
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
                    downloadFile(value);
                  }}>
                  <DownloadIcon />
                  Download
                </Button>
              </Box>
            </Popover>
          </>
        )}

        {!value && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Button
              onClick={() => inputRef.current.click()}
              sx={{
                padding: 0,
                minWidth: "25px",
                width: "25px",
                height: "25px",
              }}>
              <input
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
            {disabled && (
              <Box sx={{marginRight: "14px"}}>
                <img src="/table-icons/lock.svg" alt="lock" />
              </Box>
            )}
          </Box>
        )}
        <PdfCompiler
          value={value}
          valueGenerate={valueGenerate}
          openModal={openModal}
          handleClick={handleClick}
          handleClose={handleModalClose}
        />
      </Box>
    </>
  );
}
