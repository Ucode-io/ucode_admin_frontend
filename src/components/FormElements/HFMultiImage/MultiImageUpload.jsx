import {Box, Button, Modal} from "@mui/material";
import React, {useRef, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.scss";
import UploadIcon from "@mui/icons-material/Upload";
import fileService from "../../../services/fileService";
import DeleteIcon from "@mui/icons-material/Delete";

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
  // p: 4,
};

const mockData = [
  {
    id: 1,
    title: "1",
  },
  {
    id: 2,
    title: "1",
  },
];

function MultiImageUpload({value = [], field, tabIndex, onChange}) {
  const [uploadImg, setUploadImg] = useState(false);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);

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
    console.log("imgLink", value, imgLink);
    if (value) {
      onChange(value?.filter((item) => item !== imgLink));
    }
  };

  return (
    <>
      {value && value?.length > 0 ? (
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
            cursor: "pointer",
            position: "relative",
          }}>
          <img
            style={{width: "100%", height: "100%", border: "none"}}
            src={value?.[0]}
            type="text"
          />

          <Box
            onClick={handleClick}
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
      ) : (
        <Box
          onClick={handleClick}
          sx={{
            border: "1px dashed #ddd",
            borderRadius: "5px",
            width: "100px",
            height: "120px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            cursor: "pointer",
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

            <span>Add Photo</span>
          </Box>
        </Box>
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
                <div key={item} className={styles.ImageItem}>
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
                // disabled={disabled}
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
            <Button variant="contained" onClick={handleClose}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default MultiImageUpload;
