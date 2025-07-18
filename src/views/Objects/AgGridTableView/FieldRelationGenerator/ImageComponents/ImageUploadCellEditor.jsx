import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Rotate90DegreesCcwIcon from "@mui/icons-material/Rotate90DegreesCcw";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import {Box, Button, Modal, Popover, Typography} from "@mui/material";
import {useRef, useState} from "react";
import useDownloader from "../../../../../hooks/useDownloader";
import fileService from "../../../../../services/fileService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "700px",
  minHeight: "400px",
  border: "0px solid #000",
  p: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "80vh",
};

const ImageUploadCellEditor = ({
  value = "",
  onChange = () => {},
  className = "",
  disabled = false,
  tabIndex = 0,
  field = {},
}) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [degree, setDegree] = useState(0);
  const [imgScale, setImgScale] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const splitVal = value?.split("#")?.[1];
  const {download} = useDownloader();
  const [openFullImg, setOpenFullImg] = useState(false);
  const handleOpenImg = () => setOpenFullImg(true);
  const handleCloseImg = () => setOpenFullImg(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const imageClickHandler = (index) => {
    setPreviewVisible(true);
    window.open(value, "_blank");
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
        handleClose();
      })
      .finally(() => setLoading(false));
  };

  const rotateImg = () => {
    if (degree === 360) {
      setDegree(90);
    } else {
      setDegree(degree + 90);
    }
  };

  const deleteImage = (id) => {
    onChange(null);
  };

  const closeButtonHandler = (e) => {
    deleteImage();
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

  const downloadPhoto = (url) => {
    download({
      link: url,
      fileName: value?.split?.("_")?.[1] ?? "",
    });
  };

  return (
    <Box
      className={`Gallery ${className}`}
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        paddingLeft: "10px",
      }}>
      {value && (
        <>
          <div
            className="uploadedImage"
            aria-describedby={id}
            onClick={handleOpenImg}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                overflow: "hidden",
              }}
              className="img">
              <img
                src={value}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                className="img"
                alt={splitVal}
              />
            </div>
            <Typography
              sx={{
                fontSize: "10px",
                color: "#747474",
              }}>
              {value.split("#")[0].split("_")[1] ?? ""}
            </Typography>
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
                onClick={() => downloadPhoto(value)}>
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
                onClick={closeButtonHandler}>
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

          <Modal open={openFullImg} onClose={handleCloseImg}>
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
                onClick={handleCloseImg}
                sx={{
                  border: "0px solid #fff",
                  transform: `rotate(${degree}deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                aria-describedby={id}>
                <img
                  onClick={(e) => e.stopPropagation()}
                  src={value}
                  style={{transform: `scale(${imgScale})`}}
                  className="uploadedImage"
                  alt=""
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
                onClick={handleCloseImg}
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
                  right: "-30px",
                  bottom: "-50px",
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
                  right: "-90px",
                  bottom: "-50px",
                  color: "#eee",
                }}>
                <ZoomOutIcon style={{width: "30px", height: "30px"}} />
              </Button>
              <Button
                onClick={rotateImg}
                sx={{
                  position: "absolute",
                  right: "-150px",
                  bottom: "-50px",
                  color: "#eee",
                }}>
                <Rotate90DegreesCcwIcon
                  style={{width: "30px", height: "30px"}}
                />
              </Button>

              <Button
                onClick={() => downloadPhoto(value)}
                sx={{
                  position: "absolute",
                  right: "-240px",
                  bottom: "-50px",
                  color: "#eee",
                }}>
                <DownloadIcon
                  htmlColor="#fff"
                  style={{width: "30px", height: "30px"}}
                />
              </Button>

              <Button
                onClick={handleClick}
                sx={{
                  position: "absolute",
                  right: "-340px",
                  bottom: "-50px",
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
              minWidth: 0,
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
              accept=".jpg, .jpeg, .png, .gif"
            />

            <img
              src="/img/newUpload.svg"
              alt="Upload"
              style={{width: 22, height: 22}}
            />
          </Button>

          {field?.attributes?.disabled && (
            <Box sx={{marginRight: "14px"}}>
              <img src="/table-icons/lock.svg" alt="lock" />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ImageUploadCellEditor;
