import "./style.scss";
import { useState, useRef, useMemo } from "react";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ImageViewer from "react-simple-image-viewer";
import axios from "utils/axios";
import { CircularProgress } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import { useTranslation } from "react-i18next";

const Gallery = ({
  gallery = [],
  setGallery,
  notEditable,
  multiple = true,
  width = 140,
  height = 90,
  aspectRatio,
  rounded = false,
}) => {
  const inputRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const dispatch = useDispatch();
  const { t } = useTranslation();



  const isShow = useMemo(
    () => multiple || !gallery.length,
    [gallery, multiple],
  );
  const imageLinks = useMemo(() => {
    return gallery?.map(
      (image) => `${process.env.REACT_APP_MINIO_URL}/medion/${image}`,
    );
  }, [gallery]);

  

  const [loading, setLoading] = useState(false);

  const addNewImage = (image) => {
    imageLinks.length ? setGallery([image]) : setGallery([...gallery, image]);
  };

  const imageClickHandler = (index) => {
    setSelectedImageIndex(index);
    setPreviewVisible(true);
  };

  const inputChangeHandler = (e) => {
    setLoading(true);
    var input = e.target;
    const file = input.files[0];
    if (!file) return setLoading(false);

    if (file.size > 4194304) {
      dispatch(showAlert(t("File size must be less than 4MB"), "warning"));
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    axios
      .post("/upload", data, {
        headers: {
          "Content-Type": "mulpipart/form-data",
        },
      })
      .then((res) => {
        addNewImage(res.data.filename);
      })
      .catch((err) => console.log("error here: ", err))

      .finally(() => setLoading(false));
  };

  const deleteImage = (id) => {
    setGallery(gallery.filter((galleryImageId) => galleryImageId !== id));
  };

  const closeButtonHandler = (e, link) => {
    e.stopPropagation();
    deleteImage(link.replace(`${process.env.REACT_APP_MINIO_URL}/`, ""));
  };

  return (
    <div className={`Gallery`}>
      {imageLinks?.map((link, index) => (
        <div
          className="block mr-2"
          style={
            aspectRatio
              ? { width, aspectRatio, borderRadius: rounded ? "50%" : 8 }
              : { width, height, borderRadius: rounded ? "50%" : 8 }
          }
          onClick={() => imageClickHandler(index)}
          key={link}
        >
          {!notEditable && (
            <button
              type="button"
              className="close-btn"
              onClick={(e) => closeButtonHandler(e, link)}
            >
              <CancelIcon />
            </button>
          )}
          <img src={link} alt="" />
        </div>
      ))}

      {!notEditable && isShow && (
        <div
          className="add-block block"
          style={
            aspectRatio
              ? { width, aspectRatio, borderRadius: rounded ? "50%" : 8 }
              : { width, height, borderRadius: rounded ? "50%" : 8 }
          }
          onClick={() => inputRef.current.click()}
        >
          <div className="add-icon">
            {!loading ? (
              <>
                <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
                <p className="text-sm text-center px-3">{t("max.size.4mb")}</p>
              </>
            ) : (
              <CircularProgress />
            )}
          </div>

          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={inputChangeHandler}
            multiple={multiple}
          />
        </div>
      )}

      {previewVisible && (
        <ImageViewer
          style={{ zIndex: 100000, width, height }}
          src={imageLinks[0]}
          currentIndex={selectedImageIndex}
          disableScroll={true}
          onClose={() => setPreviewVisible(false)}
          zIndex={2}
        />
      )}
      <span
        className="mt-2 text-primary text-base align-center"
        onClick={() => inputRef.current.click()}
        style={{ cursor: "pointer" }}
      >
        {t("image")}
      </span>
    </div>
  );
};

export default Gallery;
