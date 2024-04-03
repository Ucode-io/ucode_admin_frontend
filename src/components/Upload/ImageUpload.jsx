import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {Box, Button, Modal, Popover, Typography} from "@mui/material";
import {useRef, useState} from "react";
import fileService from "../../services/fileService";
import "./Gallery/style.scss";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  height: "400px",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
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
}) => {
  const inputRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openFullImg, setOpenFullImg] = useState(false);
  const handleOpenImg = () => setOpenFullImg(true);
  const handleCloseImg = () => setOpenFullImg(false);

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
        // <div className={`block ${isNewTableView && 'tableViewBlock'}`} onClick={() => imageClickHandler()}>
        //   {!disabled ? (
        //     <button
        //       className="close-btn"
        //       type="button"
        //       onClick={(e) => closeButtonHandler(e)}
        //     >
        //       <CancelIcon />
        //     </button>
        //   ) : (
        //     <div className="lock_icon">
        //       <Lock style={{ fontSize: "20px" }} />
        //     </div>
        //   )}
        //   <img src={value} className="img" alt="" />
        // </div>

        <>
          <div
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
                alt=""
              />
            </div>
            <Typography
              sx={{
                fontSize: "10px",
                color: "#747474",
              }}>
              {value?.split?.("_")?.[1] ?? ""}
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
                Remove Image
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
                Change Image
              </Button>
            </Box>
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
          </Popover>

          <Modal open={openFullImg} onClose={handleCloseImg}>
            <Box sx={style}>
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "600px",
                  height: "400px",
                  border: "0px solid #fff",
                }}
                aria-describedby={id}
                onClick={handleClick}>
                <img
                  src={value}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  className="img"
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
            </Box>
          </Modal>
        </>
      )}

      {!value && (
        // <div
        //   className="add-block block"
        //   onClick={() => inputRef.current.click()}
        //   style={
        //     disabled
        //       ? {
        //           background: "#c0c0c039",
        //         }
        //       : {
        //           background: "inherit",
        //           color: "inherit",
        //         }
        //   }
        // >
        //   <div className="add-icon">
        //     {!loading ? (
        //       <>
        //         {disabled ? (
        //           <Tooltip title="This field is disabled for this role!">
        //             <InputAdornment position="start">
        //               <Lock style={{ fontSize: "20px" }} />
        //             </InputAdornment>
        //           </Tooltip>
        //         ) : (
        //           <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
        //         )}
        //         {/* <p>Max size: 4 MB</p> */}
        //       </>
        //     ) : (
        //       <CircularProgress />
        //     )}
        //   </div>

        //   <input type="file" className="hidden" ref={inputRef} tabIndex={tabIndex} autoFocus={tabIndex === 1} onChange={inputChangeHandler} disabled={disabled} />
        // </div>

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
          <UploadFileIcon
            style={{
              color: "#747474",
              fontSize: "25px",
            }}
          />
        </Button>
      )}

      {/* {previewVisible && (
        <ImageViewer
          src={[value]}
          currentIndex={0}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={() => setPreviewVisible(false)}
        />
      )} */}
    </div>
  );
};

export default ImageUpload;
