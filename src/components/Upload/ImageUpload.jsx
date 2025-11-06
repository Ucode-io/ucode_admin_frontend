import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Box, Button, Modal, Popover, Typography } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import fileService from "../../services/fileService";
import "./Gallery/style.scss";
import ClearIcon from "@mui/icons-material/Clear";
import Rotate90DegreesCcwIcon from "@mui/icons-material/Rotate90DegreesCcw";
import "./style.scss";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useDownloader from "../../hooks/useDownloader";
import Cropper from "react-easy-crop";

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

const ImageUpload = ({
  value,
  onChange,
  className = "",
  disabled,
  isNewTableView = false,
  tabIndex,
  field,
  drawerDetail = false,
  canCrop = true,
}) => {
  const { download } = useDownloader();

  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [degree, setDegree] = useState(0);

  const [imgScale, setImgScale] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);

  const [openFullImg, setOpenFullImg] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const splitVal = value?.split("#")?.[1];

  const handleOpenImg = () => setOpenFullImg(true);
  const handleCloseImg = () => setOpenFullImg(false);

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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

  const inputChangeCropHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUploadImage = (e) => {
    if (canCrop) inputChangeCropHandler(e);
    else inputChangeHandler(e);
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = useCallback(
    async (imageSrc, crop, outputType = "image/jpeg") => {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
      );

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          outputType,
          0.92,
        );
      });
    },
    [],
  );

  const uploadCropped = async () => {
    try {
      setLoading(true);

      const originalFileType = selectedFile?.type || "image/jpeg";
      const supportedFormats = ["image/jpeg", "image/png", "image/webp"];
      const outputType = supportedFormats.includes(originalFileType)
        ? originalFileType
        : "image/png";

      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        outputType,
      );

      const baseName = selectedFile?.name?.replace(/\.[^/.]+$/, "") || "image";
      const ext = outputType.split("/")[1];
      const croppedFileName = `${baseName}_cropped.${ext}`;

      const data = new FormData();
      data.append("file", croppedBlob, croppedFileName);

      const res = await fileService.folderUpload(data, {
        folder_name: field?.attributes?.path,
        format: field?.attributes?.format,
        ratio: field?.attributes?.ratio,
      });

      onChange(import.meta.env.VITE_CDN_BASE_URL + res?.link);
      handleClose();
    } finally {
      setLoading(false);
      setImageSrc(null);
    }
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
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {value && (
        <>
          <div
            style={{ padding: drawerDetail ? "0 10px" : 0 }}
            id="photo"
            className="uploadedImage"
            aria-describedby={id}
            // onClick={handleClick}>
            onClick={() => handleOpenImg()}
          >
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
              }}
            >
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
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "10px",
                backgroundColor: "#212B36",
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "flex-start",
                  color: "#fff",
                }}
                onClick={() => handleOpenImg()}
              >
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
                onClick={closeButtonHandler}
              >
                <DeleteIcon style={{ width: "17px", height: "17px" }} />
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
                }}
              >
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
              onChange={handleUploadImage}
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
              }}
            >
              <Box
                sx={{
                  border: "0px solid #fff",
                  transform: `rotate(${degree}deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                aria-describedby={id}
              >
                <img
                  onClick={(e) => e.stopPropagation()}
                  src={value}
                  style={{ transform: `scale(${imgScale})` }}
                  className="uploadedImage"
                  alt=""
                />
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "#747474",
                  }}
                >
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
                }}
              >
                <ClearIcon style={{ width: "30px", height: "30px" }} />
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
                }}
              >
                <ZoomInIcon style={{ width: "30px", height: "30px" }} />
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
                }}
              >
                <ZoomOutIcon style={{ width: "30px", height: "30px" }} />
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
                }}
              >
                <Rotate90DegreesCcwIcon
                  style={{ width: "30px", height: "30px" }}
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
                }}
              >
                <DownloadIcon style={{ width: "30px", height: "30px" }} />
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
                }}
              >
                <MoreHorizIcon
                  htmlColor="#fff"
                  style={{ width: "30px", height: "30px" }}
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
            }}
          >
            <input
              id="img_upload"
              type="file"
              className="hidden"
              ref={inputRef}
              tabIndex={tabIndex}
              autoFocus={tabIndex === 1}
              onChange={handleUploadImage}
              disabled={disabled}
              accept=".jpg, .jpeg, .png, .gif, .bmp, .tiff, .tif, .heif, .heic, .webp, .jp2, .j2k, .avif, .dds, .exr, .ico, .pcx, .ras, .svg"
            />
            <img
              src="/img/newUpload.svg"
              alt="Upload"
              style={{ width: 22, height: 22 }}
            />
          </Button>
        )}
      </Box>
      <Modal center open={!!imageSrc} onClose={() => setImageSrc(null)}>
        <Box
          mx="auto"
          mt={4}
          p="16px"
          pb="36px"
          position="relative"
          width="600px"
          height="400px"
          bgcolor="#fff"
          borderRadius="10px"
          overflow="hidden"
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={field?.attributes?.ratio || 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <Box
            width="100%"
            height="36px"
            padding="6px 10px"
            position="absolute"
            gap={2}
            bottom="0"
            left="0"
            display="flex"
            justifyContent="flex-end"
            bgcolor="#fff"
          >
            <Button
              onClick={() => setImageSrc(null)}
              sx={{ color: "#ee4d4d", border: "1px solid #ee4d4d" }}
            >
              Cancel
            </Button>
            <Button
              onClick={uploadCropped}
              disabled={loading}
              sx={{ color: "#007AFF", border: "1px solid #007AFF" }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export default ImageUpload;