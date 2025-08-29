import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import {Box, Button, Modal, Popover, Typography} from "@mui/material";
import {useRef, useState} from "react";
import ClearIcon from "@mui/icons-material/Clear";
import Rotate90DegreesCcwIcon from "@mui/icons-material/Rotate90DegreesCcw";
import "./style.scss";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import fileService from "../../../services/fileService";
import useDownloader from "../../../hooks/useDownloader";
import FileUploadIcon from "@mui/icons-material/FileUpload";

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
  height: "85vh",
};

const TemplateImage = ({
  value,
  onChange,
  className = "",
  disabled,
  isNewTableView = false,
  tabIndex,
  field,
  drawerDetail = false,
}) => {
  const {download} = useDownloader();
  const inputRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [degree, setDegree] = useState(0);
  const [imgScale, setImgScale] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const splitVal = value?.split("#")?.[1];
  const [openFullImg, setOpenFullImg] = useState(false);
  const handleOpenImg = () => setOpenFullImg(true);
  const handleCloseImg = () => setOpenFullImg(false);

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
        format: field?.attributes?.format,
        ratio: field?.attributes?.ratio,
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
    <div
      className={`Gallery ${className}`}
      style={{cursor: disabled ? "not-allowed" : "pointer"}}>
      {value && (
        <>
          <Box
            sx={{
              width: "100%",
              marginTop: "30px",
              height: "240px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              border: "1px solid #cccc",
            }}
            onClick={() => {
              handleOpenImg();
            }}>
            <img
              src={value}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              className="img"
              alt={splitVal}
            />
            {/* </div> */}
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
                onClick={() => handleOpenImg()}>
                <OpenInFullIcon />
                Show Full Image
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
              onClick={handleCloseImg}
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
                onClick={(e) => {
                  e.stopPropagation();
                  imageZoom("up");
                }}
                sx={{
                  position: "absolute",
                  right: "-10px",
                  bottom: "-30px",
                  color: "#eee",
                }}>
                <ZoomInIcon style={{width: "30px", height: "30px"}} />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  imageZoom("down");
                }}
                sx={{
                  position: "absolute",
                  right: "-70px",
                  bottom: "-30px",
                  color: "#eee",
                }}>
                <ZoomOutIcon style={{width: "30px", height: "30px"}} />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  rotateImg();
                }}
                sx={{
                  position: "absolute",
                  right: "-130px",
                  bottom: "-30px",
                  color: "#eee",
                }}>
                <Rotate90DegreesCcwIcon
                  style={{width: "30px", height: "30px"}}
                />
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadPhoto(value);
                }}
                sx={{
                  position: "absolute",
                  right: "-200px",
                  bottom: "-30px",
                  color: "#eee",
                }}>
                <DownloadIcon style={{width: "30px", height: "30px"}} />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(e);
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
      )}

      {Boolean(!value) && (
        <Box
          sx={{
            width: "100%",
            marginTop: "30px",
            height: "240px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
            border: "1px solid #cccc",
          }}
          onClick={() => {
            inputRef.current.click();
          }}>
          <input
            id="img_upload"
            type="file"
            className="hidden"
            ref={inputRef}
            tabIndex={tabIndex}
            autoFocus={tabIndex === 1}
            onChange={inputChangeHandler}
            disabled={disabled}
            accept=".jpg, .jpeg, .png, .gif, .bmp, .tiff, .tif, .heif, .heic, .webp, .jp2, .j2k, .avif, .dds, .exr, .ico, .pcx, .ras, .svg"
          />
          <Box>
            <FileUploadIcon style={{width: "30px", height: "30px"}} />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default TemplateImage;
