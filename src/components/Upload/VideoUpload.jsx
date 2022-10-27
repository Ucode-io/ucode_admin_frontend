import AddCircleOutlineIcon from "@mui/icons-material/Upload"
import { useState } from "react"
import { useRef } from "react"
import ImageViewer from "react-simple-image-viewer"
import { CircularProgress } from "@mui/material"
import CancelIcon from "@mui/icons-material/Cancel"
import "./style.scss"
import fileService from "../../services/fileService"
import * as tus from "tus-js-client"

const VideoUpload = ({ value, onChange, className = "", disabled }) => {
  const inputRef = useRef(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const imageClickHandler = (index) => {
    setPreviewVisible(true)
  }

  const inputChangeHandler = (e) => {
    setLoading(true)

    // ***** ***** //
    const file = e.target.files[0]

    // Create a new tus upload
    var upload = new tus.Upload(file, {
      endpoint: "https://test.api.admin.editorypress.uz/v1/upload-videos/",
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: function (error) {
        console.log("Failed because: " + error)
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
        console.log(bytesUploaded, bytesTotal, percentage + "%")
      },
      onSuccess: function () {
        console.log("Download %s from %s", upload.file.name, upload.url)
      },
    })

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0])
      }

      // Start the upload
      upload.start()
    })

    // ***** ***** //
    // const data = new FormData()
    // data.append("file", file)

    // fileService
    //   .upload(data)
    //   .then((res) => {
    //     onChange(import.meta.env.VITE_CDN_BASE_URL + res.filename)
    //   })
    //   .finally(() => setLoading(false))
  }

  const deleteImage = (id) => {
    onChange(null)
  }

  const closeButtonHandler = (e) => {
    e.stopPropagation()
    deleteImage()
  }

  return (
    <div className={`Gallery ${className}`}>
      {value && (
        <div className="block" onClick={() => imageClickHandler()}>
          <button
            className="close-btn"
            type="button"
            onClick={(e) => closeButtonHandler(e)}
          >
            <CancelIcon />
          </button>
          {/* <img src={value} className="img" alt="" /> */}
          <video src={value} className="img" />
        </div>
      )}

      {!value && (
        <div
          className="add-block block"
          onClick={() => inputRef.current.click()}
        >
          <div className="add-icon">
            {!loading ? (
              <>
                <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
                {/* <p>Max size: 4 MB</p> */}
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
            disabled={disabled}
          />
        </div>
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
  )
}

export default VideoUpload
