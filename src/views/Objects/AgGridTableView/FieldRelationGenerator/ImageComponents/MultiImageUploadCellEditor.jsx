import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {Box, Button, Modal} from "@mui/material";
import React, {useMemo, useRef, useState} from "react";
import fileService from "../../../../../services/fileService";
import styles from "../style.module.scss";
import TelegramMultiImageViewer from "../../../../../components/FormElements/HFMultiImage/TelegramMultiImage";

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

function MultiImageUploadCellEditor({
  value = [],
  tabIndex = 0,
  onChange = () => {},
  disabled = false,
}) {
  const [fullScreen, setFullScreen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [uploadImg, setUploadImg] = useState(false);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);

  const handleFullScreen = (imgSrc) => {
    handleClick();
    setFullScreen(imgSrc);
    handleOpenGallery();
  };

  function handleOpenGallery() {
    setOpenGallery(true);
  }
  function handleCloseGallery() {
    setOpenModal(false);
    setFullScreen(false);
  }

  const handleCloseFullScreen = () => {
    setFullScreen(false);
  };

  const handleClick = () => {
    setUploadImg(true);
  };

  const handleClose = () => {
    setUploadImg(false);
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
        onChange([...value, import.meta.env.VITE_CDN_BASE_URL + res?.link]);
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
          <Box
            onClick={() => !disabled && handleClick()}
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 0 0 13px",
            }}>
            {/* <Box
              sx={{
                height: "25px",
                width: "27px",
                borderRadius: "4px",
                overflow: "hidden",
                padding: "0 0 0 0",
              }}>
              <img
                style={{width: "100%", height: "100%", objectFit: "cover"}}
                src={value?.[0]}
              />
            </Box>
            <Box sx={{fontSize: "10px", wordBreak: "keep-all"}}>
              {parseImgPhoto(value?.[0])}
            </Box> */}
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
              </>
            ))}

            {disabled && (
              <Box
                sx={{
                  position: "absolute",
                  right: "14px",
                  height: "20px",
                  width: "20px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  padding: "0 0 0 0",
                  background: "transparent",
                }}>
                <img
                  src="/table-icons/lock.svg"
                  style={{width: "20px", height: "20px"}}
                  alt="lock"
                />
              </Box>
            )}
          </Box>
        </>
      ) : (
        <>
          <Box
            onClick={() => !disabled && handleClick()}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: disabled ? "space-between" : "",
              cursor: "pointer",
              paddingLeft: "10px",
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
              <img
                src="/img/newUpload.svg"
                alt="Upload"
                style={{width: 22, height: 22}}
              />
            </Box>
            {disabled && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  alignContent: "flex-end",
                  color: "#777",
                  fontSize: "10px",
                  gap: "5px",
                  marginRight: "14px",
                }}>
                <img
                  src="/table-icons/lock.svg"
                  style={{width: "20px", height: "20px"}}
                  alt="lock"
                />
              </Box>
            )}
          </Box>
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
            <Box></Box>
            <Button onClick={handleClose}>
              <CloseIcon style={{width: "24", height: "24px"}} />
            </Button>
          </Box>

          <div className={styles.imageContainer}>
            {value &&
              value?.map((item) => (
                <div
                  onClick={setOpenModal}
                  key={item}
                  className={styles.ImageItem}>
                  <img src={item} alt="photo" />

                  <button
                    onClick={() => {
                      removeImage(item);
                    }}
                    className={styles.clearBtn}>
                    <DeleteIcon style={{color: "red"}} />
                  </button>
                </div>
              ))}
            <Box
              sx={{
                border: "1px dashed #ddd",
                borderRadius: "5px",
                width: "135px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                cursor: "pointer",
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
                disabled={disabled}
              />
              <img
                src="/img/newUpload.svg"
                alt="Upload"
                style={{width: 22, height: 22}}
              />
              {/* <UploadIcon style={{width: "32px", height: "32px"}} /> */}
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
                handleClose();
              }}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <TelegramMultiImageViewer
        open={openModal}
        onClose={handleCloseGallery}
        images={imagesSrc}
      />
    </>
  );
}

export default MultiImageUploadCellEditor;
