import "./styles.scss"
import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import SvgIcon from "./Icons"
import FilesList from "./FilesList"
import CircularProgress from "@material-ui/core/CircularProgress"
import Button from "../../Button"
import axios from "../../../utils/axios"
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';

export default function UploadWithComment({
  title = "Drag and drop files here",
  buttonTitle = "Browse",
  style,
  className,
  loading,
  disabled,
  placeholder = "Comment...",
  onChange = function () {},
}) {
  // **** USE-HOOKS ****
  const [files, setFiles] = useState([])
  const onDrop = useCallback((acceptedFiles) => {
    // console.log(acceptedFiles);
    setFiles((old) => [
      ...old,
      ...acceptedFiles.map((file) => ({ file, comment: "" })),
    ])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className={`upload-with-comment ${className}`} style={style}>
      {/* DROPZONE */}
      <div {...getRootProps()} className="dropzone" style={{ height: 164 }}>
        <input {...getInputProps()} />
        <MoveToInboxIcon style={{ fontSize: "50px" }} />
              <p className="title">
                <h1>Faylni yuklang</h1>
              </p>
      </div>

      {/* FILES-LIST */}
      <FilesList files={files} setFiles={setFiles} placeholder={placeholder} addUploadedFile={onChange} />
      
      {/* WRAPPER */}
      <div
        className="wrapper"
        style={{ visibility: disabled || loading ? "visible" : "hidden" }}
      >
        {loading && <CircularProgress size={40} />}
      </div>
    </div>
  )
}
