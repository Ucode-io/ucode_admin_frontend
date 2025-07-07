import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import {Box, Button, Modal, Popover, Typography} from "@mui/material";
import {useRef, useState} from "react";
import fileService from "../../services/fileService";
import "./Gallery/style.scss";
import ClearIcon from "@mui/icons-material/Clear";
import Rotate90DegreesCcwIcon from "@mui/icons-material/Rotate90DegreesCcw";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import "./style.scss";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

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

const ImageUpload = ({
  value,
  onChange,
  className = "",
  disabled,
  isNewTableView = false,
  tabIndex,
  field,
  drawerDetail = false,
}) => {
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

  return (
    <div
      className={`Gallery ${className}`}
      style={{cursor: disabled ? "not-allowed" : "pointer"}}>
      {value && (
        <>
          <div
            style={{padding: drawerDetail ? "0 10px" : 0}}
            id="photo"
            className="uploadedImage"
            aria-describedby={id}
            onClick={handleClick}>
            <div className="img">
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
              }}>
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "flex-start",
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
                }}
                onClick={() => imageClickHandler()}>
                <DownloadIcon />
                Dowload
              </Button>
              <RectangleIconButton
                color="error"
                className="removeImg"
                onClick={closeButtonHandler}>
                <DeleteIcon
                  style={{width: "17px", height: "17px", marginRight: "12px"}}
                />
                Remove Image
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
                Change Image
              </Button>
            </Box>
            <input
              id="image_photo"
              type="file"
              style={{
                display: "none",
              }}
              accept=".jpg, .jpeg, .png, .gif, .bmp, .tiff, .tif, .heif, .heic, .webp, .jp2, .j2k, .avif, .dds, .exr, .ico, .pcx, .ras"
              className="hidden"
              ref={inputRef}
              tabIndex={tabIndex}
              autoFocus={tabIndex === 1}
              onChange={inputChangeHandler}
              disabled={disabled}
            />
          </Popover>

          <Modal open={openFullImg} onClose={handleCloseImg}>
            <Box sx={style}>
              <Box
                sx={{
                  border: "0px solid #fff",
                  transform: `rotate(${degree}deg)`,
                }}
                aria-describedby={id}
                onClick={handleClick}>
                <img
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
                  right: "-150px",
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
                  right: "-220px",
                  bottom: "-50px",
                  color: "#eee",
                }}>
                <ZoomOutIcon style={{width: "30px", height: "30px"}} />
              </Button>
              <Button
                onClick={rotateImg}
                sx={{
                  position: "absolute",
                  right: "-300px",
                  bottom: "-50px",
                  color: "#eee",
                }}>
                <Rotate90DegreesCcwIcon
                  style={{width: "30px", height: "30px"}}
                />
              </Button>
            </Box>
          </Modal>
        </>
      )}

      <Box>
        {!value && (
          <Button
            id="imageUploadBtn"
            disabled={disabled}
            onClick={() => {
              inputRef.current.click();
            }}
            sx={{
              padding: 0,
              minWidth: 40,
              width: 40,
              height: 27,
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
              accept=".jpg, .jpeg, .png, .gif, .bmp, .tiff, .tif, .heif, .heic, .HEIC, .webp, .jp2, .j2k, .avif, .dds, .exr, .ico, .pcx, .ras"
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
};

export default ImageUpload;
