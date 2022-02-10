import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import "../UploadWithComment/styles.scss"
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox"
import axios from "../../../utils/axios"
// import Button from "../../Button"
// import EditIcon from "@material-ui/icons/Edit"
// import DeleteIcon from "@material-ui/icons/Delete"
// import DescriptionIcon from "@material-ui/icons/Description"
import "../style.scss"
import { CircularProgress } from "@material-ui/core"
import { useRef } from "react"
import { useDispatch } from "react-redux"
import { showAlert } from "../../../redux/reducers/alertReducer"

const UploadWithDrag = ({ setFile, file, geoJSON }) => {
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false)
  const [fileName, setFileName] = useState("")
  const inputRef = useRef(null)

  // useEffect(() => {
  //   setFile(uploadedFile)
  // }, [uploadedFile])

  const onDrop = useCallback((files) => {
    const file = files[0]
    if (
      !(
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed"
      )
    )
      return dispatch(showAlert("Fayllar faqat .zip formatida bo'lishi lozim"))
    setFileName(file.name)
    setLoader(true)
    const data = new FormData()
    data.append("file", file)
    data.append("comment", "")

    axios
      .post("/file-upload", data, {
        headers: {
          "Content-Type": "mulpipart/form-data",
        },
      })
      .then((res) => {
        setFile(res.file_path)
      })
      .catch(() => setLoader(false))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  // const clearFile = () => {
  //   setFile(null)
  // }

  return (
    <div className="upload-with-comment Upload">
      <div
        {...getRootProps()}
        className="dropzone"
        ref={inputRef}
        style={{ height: 164 }}
      >
        <input {...getInputProps()} />
        {!loader ? (
          <>
            <MoveToInboxIcon style={{ fontSize: "50px" }} />
            <p className="title">
              <h1>Faylni yuklang</h1>
            </p>
          </>
        ) : (
          <CircularProgress />
        )}
      </div>
      {/* <div className="flex items-center"> */}

      {/* <a
            download
            target="_blank"
            rel="noreferrer"
            href={`https://cdn.ekadastr.udevs.io/ekadastr/${file}`}
          >
            <Button
              // loading={loader}
              color="primary"
              icon={DescriptionIcon}
            >
              {fileName}
            </Button>
          </a>
          <button
            onClick={clearFile}
            type="button"
            className="func-btn delete rounded-lg mx-5 "
          >
            <DeleteIcon />
          </button> */}
      {/* </div> */}
    </div>
  )
}

export default UploadWithDrag
