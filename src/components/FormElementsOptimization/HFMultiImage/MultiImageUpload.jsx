import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CollectionsIcon from "@mui/icons-material/Collections";
import {Box, Button, Modal, CircularProgress, Typography, IconButton, Fade, Backdrop} from "@mui/material";
import React, {useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import fileService from "../../../services/fileService";
import styles from "./styles.module.scss";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import TelegramMultiImageViewer from "./TelegramMultiImage";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(90vw, 900px)",
  maxHeight: "85vh",
  overflow: "hidden",
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
};

function MultiImageUpload({
  value = [],
  tabIndex,
  onChange = () => {},
  isTableView,
  updateObject,
  newUi,
  disabled,
  drawerDetail = false,
  field,
}) {
  const [uploadImg, setUploadImg] = useState(false);
  const [fullScreen, setFullScreen] = useState("");
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [imageList, setImageList] = useState([]);
  const [openGallery, setOpenGallery] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => setUploadImg(true);
  const handleClose = () => setUploadImg(false);

  const handleFullScreen = (imgSrc) => {
    handleClick();
    setFullScreen(imgSrc);
    handleOpenGallery();
  };

  function handleOpenGallery() {
    setOpenGallery(true);
  }
  function handleCloseGallery() {
    setOpenGallery(false);
    setFullScreen(null);
  }

  const handleCloseFullScreen = () => {
    handleCloseGallery(false);
    setFullScreen(null);
  };
  const processFiles = async (files) => {
    if (files.length === 0) return;

    setLoading(true);
    setUploadProgress({ current: 0, total: files.length });

    const uploadedUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append("file", file);

        const fileExt = file?.name?.split(".")?.pop()?.toUpperCase();
        const sendFormat = fileExt || field?.attributes?.format;

        const res = await fileService.folderUpload(data, {
          folder_name: field?.attributes?.path || "media",
          format: sendFormat,
        });

        const imageUrl = import.meta.env.VITE_CDN_BASE_URL + res?.link;
        uploadedUrls.push(imageUrl);
        setUploadProgress({ current: i + 1, total: files.length });
      }

      onChange([...(value ?? []), ...uploadedUrls]);
      setImageList([...imageList, ...uploadedUrls]);
    } finally {
      setLoading(false);
      setUploadProgress({ current: 0, total: 0 });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const inputChangeHandler = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    await processFiles(files);
  };

  const removeImage = (imgLink) => {
    if (value) {
      onChange(value?.filter((item) => item !== imgLink));
    }
  };

  const parseImgPhoto = (item) => {
    const parts = item?.split("/");
    const photoName = parts[parts.length - 1];
    return photoName?.slice(0, 30);
  };

  const imagesSrc = useMemo(() => {
    if (!value?.length) return [];
    return value?.map((item) => ({
      src: item,
    }));
  }, [value]);

  return (
    <>
      {value && value?.length > 0 ? (
        <>
          {isTableView ? (
            <Box
              onClick={() => {
                !disabled && handleClick();
              }}
              id="multi_image"
              sx={{
                width: "100%",
                height: newUi ? "25px" : "36px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: drawerDetail ? "0 9.6px" : "0",
                cursor: disabled ? "not-allowed" : "pointer",
                "&:hover": {
                  "& .image-thumb": {
                    transform: "scale(1.05)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }
                }
              }}
            >
              {value?.slice(0, 4).map((img, index) => (
                <Box
                  key={index}
                  className="image-thumb"
                  sx={{
                    height: "28px",
                    width: "28px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: "2px solid #fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "all 0.2s ease",
                    marginLeft: index > 0 ? "-8px" : "0",
                    position: "relative",
                    zIndex: value.length - index,
                  }}
                  title={parseImgPhoto(img)}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={img}
                    alt="img"
                  />
                </Box>
              ))}
              {value?.length > 4 && (
                <Box
                  sx={{
                    height: "28px",
                    width: "28px",
                    borderRadius: "6px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#fff",
                    marginLeft: "-8px",
                    border: "2px solid #fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  +{value.length - 4}
                </Box>
              )}
            </Box>
          ) : (
            <Box
              onClick={() => {
                !disabled && handleClick();
              }}
              sx={{
                borderRadius: "12px",
                width: "100px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                cursor: disabled ? "not-allowed" : "pointer",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  "& .overlay": {
                    background: "rgba(0, 0, 0, 0.5)",
                  }
                }
              }}
            >
              <img
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                }}
                src={value?.[0]}
                alt="preview"
              />

              <Box
                className="overlay"
                id="multi_image_2"
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)",
                  right: "0",
                  top: "0",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <CollectionsIcon sx={{ color: "#fff", fontSize: 28, mb: 0.5 }} />
                <Typography 
                  sx={{ 
                    fontSize: "18px", 
                    fontWeight: 600, 
                    color: "#fff",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                  }}
                >
                  {value?.length}
                </Typography>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <>
          {isTableView ? (
            <Box
              id="multi_images"
              onClick={() => {
                !disabled && handleClick();
              }}
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                cursor: disabled ? "not-allowed" : "pointer",
                justifyContent: "flex-start",
                alignItems: "center",
                "&:hover": {
                  "& .upload-icon": {
                    transform: "scale(1.1)",
                    color: "#667eea",
                  }
                }
              }}
            >
              <Box
                className="upload-icon"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 8px",
                  transition: "all 0.2s ease",
                }}
              >
                <CloudUploadIcon 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    color: "#9ca3af",
                    transition: "all 0.2s ease",
                  }} 
                />
              </Box>
            </Box>
          ) : (
            <Box
              id="multi_images_2"
              onClick={() => {
                !disabled && handleClick();
              }}
              sx={{
                border: "2px dashed #e0e0e0",
                borderRadius: "12px",
                width: "100px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                cursor: disabled ? "not-allowed" : "pointer",
                background: "linear-gradient(145deg, #fafafa 0%, #f5f5f5 100%)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#667eea",
                  background: "linear-gradient(145deg, #f0f4ff 0%, #e8edff 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                  "& .add-icon": {
                    transform: "scale(1.1)",
                    color: "#667eea",
                  }
                }
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  color: "#9ca3af",
                  gap: "8px",
                }}
              >
                <AddIcon 
                  className="add-icon"
                  sx={{ 
                    width: "28px", 
                    height: "28px",
                    transition: "all 0.2s ease",
                  }} 
                />
                <Typography 
                  sx={{ 
                    fontSize: "11px", 
                    fontWeight: 500,
                    color: "#6b7280"
                  }}
                >
                  {t("add_photo")}
                </Typography>
              </Box>
            </Box>
          )}
        </>
      )}

      <Modal 
        open={uploadImg} 
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }
        }}
      >
        <Fade in={uploadImg}>
          <Box sx={modalStyle}>
            {/* Header */}
            <Box
              sx={{
                padding: "16px 20px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(to right, #fafafa, #ffffff)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CollectionsIcon sx={{ color: "#667eea", fontSize: 24 }} />
                <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#1f2937" }}>
                  {t("add_photo")}
                </Typography>
                {value?.length > 0 && (
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "2px 10px",
                      borderRadius: "12px",
                    }}
                  >
                    {value.length}
                  </Box>
                )}
              </Box>
              <IconButton 
                onClick={handleClose}
                sx={{ 
                  color: "#6b7280",
                  "&:hover": { 
                    background: "#fee2e2", 
                    color: "#ef4444" 
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Box 
              sx={{ 
                padding: "24px",
                maxHeight: "calc(85vh - 140px)",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1",
                  borderRadius: "3px",
                  "&:hover": {
                    background: "#a1a1a1",
                  }
                }
              }}
            >
              <div className={styles.imageContainer}>
                {value &&
                  value?.map((item, index) => (
                    <div
                      key={item}
                      className={styles.ImageItem}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFullScreen(item);
                      }}
                    >
                      <img src={item} alt="photo" />
                      <Box className={styles.imageIndex}>
                        {index + 1}
                      </Box>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(item);
                        }}
                        className={styles.clearBtn}
                        sx={{
                          background: "rgba(255,255,255,0.9) !important",
                          "&:hover": {
                            background: "#fee2e2 !important",
                          }
                        }}
                      >
                        <DeleteIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                      </IconButton>
                      <Box className={styles.fullBtn}>
                        <FullscreenIcon sx={{ color: "#fff", fontSize: 32 }} />
                      </Box>
                    </div>
                  ))}

                {/* Upload Zone */}
                <Box
                  id="uploadImageField"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  sx={{
                    border: isDragOver ? "2px dashed #667eea" : "2px dashed #e0e0e0",
                    borderRadius: "12px",
                    width: "150px",
                    height: "140px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    cursor: disabled ? "not-allowed" : "pointer",
                    position: "relative",
                    background: isDragOver 
                      ? "linear-gradient(145deg, #f0f4ff 0%, #e8edff 100%)" 
                      : "linear-gradient(145deg, #fafafa 0%, #f5f5f5 100%)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#667eea",
                      background: "linear-gradient(145deg, #f0f4ff 0%, #e8edff 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!loading) inputRef.current.click();
                  }}
                >
                  <input
                    type="file"
                    multiple
                    style={{
                      display: "none",
                    }}
                    accept=".jpg, .jpeg, .png, .gif, .bmp, .tiff, .tif, .heif, .heic, .webp, .jp2, .j2k, .avif, .dds, .exr, .ico, .pcx, .ras, .svg"
                    className="hidden"
                    ref={inputRef}
                    tabIndex={tabIndex}
                    autoFocus={tabIndex === 1}
                    onChange={inputChangeHandler}
                  />
                  {loading ? (
                    <Box sx={{ textAlign: "center" }}>
                      <CircularProgress size={32} sx={{ color: "#667eea" }} />
                      {uploadProgress.total > 0 && (
                        <Typography sx={{ mt: 1, fontSize: "12px", color: "#6b7280" }}>
                          {uploadProgress.current} / {uploadProgress.total}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 36, color: isDragOver ? "#667eea" : "#9ca3af", mb: 1 }} />
                      <Typography sx={{ fontSize: "12px", color: "#6b7280", textAlign: "center", px: 1 }}>
                        {isDragOver ? t("drop_here") || "Drop here" : t("drag_or_click") || "Drag & drop or click"}
                      </Typography>
                    </>
                  )}
                </Box>
              </div>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                padding: "16px 20px",
                borderTop: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 2,
                background: "#fafafa",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  borderColor: "#e0e0e0",
                  color: "#6b7280",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#d0d0d0",
                    background: "#f5f5f5",
                  }
                }}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  isTableView && updateObject();
                  handleClose();
                }}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)",
                    boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                  }
                }}
              >
                {t("save_btn")}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <TelegramMultiImageViewer
        open={fullScreen}
        onClose={handleCloseFullScreen}
        images={imagesSrc}
      />
    </>
  );
}

export default MultiImageUpload;
