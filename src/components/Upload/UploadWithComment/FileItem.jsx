import Input from "../../Input"
import SvgIcon from "./Icons"
import SaveIcon from "@material-ui/icons/Save"
import axios from "../../../utils/axios"
import { useState } from "react"
import { CircularProgress } from "@material-ui/core"

const FileItem = ({
  index,
  element,
  placeholder,
  onInputChange,
  onRemoveClick,
  files,
  addUploadedFile
}) => {
  const [loader, setLoader] = useState(false)

  const onSaveClick = (index) => {
    uploadFile(files[index])
  }

  const uploadFile = ({ file, comment }) => {
    setLoader(true)
    const data = new FormData()
    data.append("file", file)
    data.append("comment", comment)

    axios
      .post("/file-upload", data, {
        headers: {
          "Content-Type": "mulpipart/form-data",
        },
      })
      .then((res) => {
        addUploadedFile(res.file_path)
        onRemoveClick(index)
        // setUploadedFile(res.file_path)
      })
      .finally(() => setLoader(false))
  }

  return (
    <div className="file-item" key={index}>
      <div className="file-title">
        <div>
          <SvgIcon name="document" />
        </div>
        <p className="filename truncate" title={element.file.name}>
          {element.file.name}
        </p>
      </div>

      {loader ? (
        <div>
          <CircularProgress size="15px" />
        </div>
      ) : (
        <>
          <Input
            placeholder={placeholder}
            value={element.comment}
            onChange={(e) => onInputChange(e.target.value, index)}
            // onBlur={(e) => onInputChange(e.target.value, i)}
          />

          <div className="remove-btn" onClick={() => onRemoveClick(index)}>
            <SvgIcon name="close" />
          </div>
          <div
            className="remove-btn save-btn"
            onClick={() => onSaveClick(index)}
          >
            <SaveIcon style={{ fontSize: "18px" }} />
          </div>
        </>
      )}
    </div>
  )
}

export default FileItem
