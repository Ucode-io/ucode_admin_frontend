// import axios from "../../../utils/axios"
import FileItem from "./FileItem"

export default function FilesList({ files = [], setFiles, placeholder, addUploadedFile }) {
  // **** FUNCTIONS ****
  const onInputChange = (text, index) => {
    setFiles((old) =>
      old.map((elm, i) => (i === index ? { ...elm, comment: text } : elm))
    )
  }

  const onRemoveClick = (index) => {
    setFiles((old) => old.filter((elm, i) => i !== index))
  }

  // const onSaveClick = (index) => {}

  return files.length ? (
    <div className="files-list">
      {files.map((el, i) => (
        <FileItem
          key={i}
          index={i}
          element={el}
          placeholder={placeholder}
          onInputChange={onInputChange}
          onRemoveClick={onRemoveClick}
          files={files}
          addUploadedFile={addUploadedFile}
        />
      ))}
    </div>
  ) : (
    <></>
  )
}
