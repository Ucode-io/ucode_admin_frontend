import { useState } from "react"
import { useRef } from "react"
import Button from "../Button"
import "./style.scss"
import axios from "../../utils/axios"
import DescriptionIcon from "@material-ui/icons/Description"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import { useEffect } from "react"

const Upload = ({ value = null, onChange = () => {}, error, disabled }) => {
  const inputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [ file, setFile ] = useState(null)
  const [innerValue, setInnerValue] = useState(null)

  useEffect(() => {
    setInnerValue(value)
  }, [])

  useEffect(() => {
    
  }, [innerValue])

  const buttonClickHandler = () => {
    inputRef.current.click()
  }

  const inputChangeHandler = (e) => {
    setLoading(true)
    const file = e.target.files[0]
    setFile(file)

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
        setInnerValue(res.file_path)
        onChange(res.file_path)
      })
      .finally(() => setLoading(false))
  }

  const clearValue = () => {
    setInnerValue(null)
    onChange(null)
  }

  return (
    <div className="Upload w-full bg-white rounded-lg  border-gray-200 flex items-center justify-end">
      {innerValue ? (
        <>
          <a
            download
            target="_blank"
            rel="noreferrer"
            href={`https://cdn.ekadastr.udevs.io/ekadastr/${innerValue}`}
          >
            <Button
              loading={loading}
              color="primary"
              icon={DescriptionIcon}
            >
              Faylni yuklab olish
            </Button>
          </a>
          {!disabled ? (
            <>
              <button
                onClick={buttonClickHandler}
                type="button"
                className="func-btn edit mx-3 rounded-lg "
              >
                <EditIcon />
              </button>
              <button
                onClick={clearValue}
                type="button"
                className="func-btn delete rounded-lg "
              >
                <DeleteIcon />
              </button>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <Button
          shape="outlined"
          color={error ? "red" : "primary"}
          loading={loading}
          onClick={buttonClickHandler}
          disabled={disabled}
        >
          Faylni tanlash
        </Button>
      )}

      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={inputChangeHandler}
      />
    </div>
  )
}

export default Upload

// export default function Upload ({
//   className = "",
//   style = {},
//   comment = "",
//   action = "",
//   filename = "file",
//   title,
//   beforeUpload  = function () {},
//   onUploading = function () {},
//   onUploaded = function () {},
//   customRequest = function () {},
//   ...rest
// }) {
//   return (
//     <div {...rest} style={style} className={`
//       p-1
//       px-2
//       flex
//       w-full
//       border
//       text-body
//       space-x-2
//       bg-white
//       transition
//       rounded-lg
//       font-smaller
//       items-center
//       border-gray-200
//       focus-within:ring
//       focus-within:outline-none
//       focus-within:border-blue-300
//       ${className}
//     `}>
//       <div></div>
//       <input type="file" placeholder="upload" onChangeFromAnyWhereAndOpenWhereFromAny />
//     </div>
//   )
// }
