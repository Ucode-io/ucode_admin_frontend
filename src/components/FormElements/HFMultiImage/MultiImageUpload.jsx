import {Box, Button, Modal} from "@mui/material";
import React, {useMemo, useRef, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.scss";
import UploadIcon from "@mui/icons-material/Upload";
import fileService from "../../../services/fileService";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import {useTranslation} from "react-i18next";
// import ImageGallery from "react-image-gallery";
// import "react-image-gallery/styles/css/image-gallery.css";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";

import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import TelegramMultiImageViewer from "./TelegramMultiImage";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  height: "500px",
  overflow: "scroll",
  bgcolor: "background.paper",
  border: "0px solid #000",
  borderRadius: "5px",
  boxShadow: 24,
};

function MultiImageUpload({
  value = [],
  field,
  tabIndex,
  onChange = () => {},
  isTableView,
  updateObject,
  newUi,
  disabled,
  drawerDetail = false,
}) {
  const [uploadImg, setUploadImg] = useState(false);
  const [fullScreen, setFullScreen] = useState("");
  const {i18n, t} = useTranslation();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [openGallery, setOpenGallery] = useState(false);

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
  const inputChangeHandler = (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);
    fileService
      .folderUpload(data, {
        folder_name: "media",
      })
      .then((res) => {
        onChange([
          ...(value ?? []),
          import.meta.env.VITE_CDN_BASE_URL + res?.link,
        ]);
        setImageList([
          ...imageList,
          import.meta.env.VITE_CDN_BASE_URL + res?.link,
        ]);
      })
      .finally(() => setLoading(false));
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
                gap: "10px",
                padding: drawerDetail ? "0 9.6px" : "0",
                cursor: disabled ? "not-allowed" : "pointer",
              }}>
              {value?.map((img, index) => (
                <>
                  <Box
                    key={index}
                    sx={{
                      height: "25px",
                      width: "27px",
                      borderRadius: "4px",
                      overflow: "hidden",
                      padding: "0 0 0 0",
                    }}
                    title={parseImgPhoto(img)}>
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
                  {/* <Box sx={{ fontSize: "10px", wordBreak: "keep-all" }}> */}
                  {/* {parseImgPhoto(value?.[0])} */}
                  {/* </Box> */}
                </>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                border: "1px dashed #ddd",
                borderRadius: "5px",
                width: "100px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                cursor: disabled ? "not-allowed" : "pointer",
              }}>
              <img
                style={{width: "100%", height: "100%", border: "none"}}
                src={value?.[0]}
                type="text"
              />

              <Box
                id="multi_image_2"
                onClick={() => {
                  !disabled && handleClick();
                }}
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: "rgba(0, 0, 0, 0.3)",
                  right: "0",
                  top: "0",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  fontSize: "16px",
                  color: "#fff",
                }}>
                {value?.length > 1 ? `${value?.length}+` : value?.length}
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
              }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  color: "#777",
                  fontSize: "10px",
                  gap: "5px",
                  padding: "0 8px",
                }}>
                <img
                  src="/img/newUpload.svg"
                  alt="Upload"
                  style={{width: 22, height: 22}}
                />
                {/* <UploadFileIcon
                  style={{
                    width: "24px",
                    height: "24px",
                    color: "rgb(116, 116, 116)",
                  }}
                /> */}
              </Box>
            </Box>
          ) : (
            <Box
              id="multi_images_2"
              onClick={() => {
                !disabled && handleClick();
              }}
              sx={{
                border: "1px dashed #ddd",
                borderRadius: "5px",
                width: "100px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                cursor: disabled ? "not-allowed" : "pointer",
              }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  color: "#777",
                  fontSize: "10px",
                  gap: "5px",
                }}>
                <AddIcon style={{width: "24px", height: "24px"}} />

                <span>{t("add_photo")}</span>
              </Box>
            </Box>
          )}
        </>
      )}

      <Modal open={uploadImg} onClose={handleClose}>
        <Box sx={style}>
          <Box
            sx={{
              padding: "5px",
              borderBottom: "1px solid #e7e7e7",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: "0",
              zIndex: "999",
              background: "white",
            }}>
            <Button onClick={handleClose}>
              <CloseIcon style={{width: "24", height: "24px"}} />
            </Button>
          </Box>

          <div className={styles.imageContainer}>
            {value &&
              value?.map((item) => (
                <div
                  key={item}
                  className={styles.ImageItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFullScreen(item);
                  }}>
                  <img src={item} alt="photo" />

                  <button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(item);
                    }}
                    className={styles.clearBtn}>
                    <DeleteIcon style={{color: "red"}} />
                  </button>
                  <Button className={styles.fullBtn} onClick={handleClose}>
                    <FullscreenIcon style={{width: "35px", height: "35px"}} />
                  </Button>
                </div>
              ))}
            <Box
              id="uploadImageField"
              sx={{
                border: "1px dashed #ddd",
                borderRadius: "5px",
                width: "135px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                cursor: disabled ? "not-allowed" : "pointer",
                position: "relative",
              }}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current.click();
              }}>
              <input
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
              />
              <UploadIcon style={{width: "32px", height: "32px"}} />
            </Box>
          </div>

          <Box
            sx={{
              padding: "5px",
              borderTop: "1px solid #e7e7e7",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "absolute",
              bottom: "0",
              zIndex: "999",
              background: "white",
              width: "100%",
            }}>
            <Box></Box>
            <Button
              variant="contained"
              onClick={() => {
                isTableView && updateObject();
                handleClose();
              }}>
              {t("save_btn")}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* <Modal open={Boolean(fullScreen)} onClose={handleCloseFullScreen}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Lightbox
            open={openGallery}
            close={handleCloseGallery}
            slides={imagesSrc}
            render={{
              buttonPrev: () => null,
              buttonNext: () => null,
            }}
            plugins={[Thumbnails, Zoom, Download]}
            carousel={{finite: true}}
            styles={{
              container: {backgroundColor: "transparent"},
              thumbnailsContainer: {
                position: "relative",
                margin: 0,
                padding: "10px 0",
                width: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                justifyContent: "center",
                display: "flex",
              },
              thumbnail: {
                margin: "0 0px",
                borderRadius: 4,
                cursor: "pointer",
                width: 60,
                height: 90,
                objectFit: "cover",
              },
            }}
          />
        </Box>
      </Modal> */}

      <TelegramMultiImageViewer
        open={fullScreen}
        onClose={handleCloseFullScreen}
        images={imagesSrc}
      />
    </>
  );
}

export default MultiImageUpload;
