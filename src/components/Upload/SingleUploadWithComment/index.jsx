import { useDropzone } from "react-dropzone"
import "../UploadWithComment/styles.scss"
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox"
import { useState } from "react"
import SvgIcon from "../UploadWithComment/Icons"
import Input from "../../Input"
import Button from "../../Button"
import { useTranslation } from "react-i18next"
import axios from "../../../utils/axios"

const SingleUploadWithComment = ({ type, regionId, setUpdater }) => {
  const [file, setFile] = useState(null)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const onDrop = (dropedFiles) => {
    setFile(dropedFiles[0])
  }

  const removeFile = () => {
    setFile(null)
    setComment("")
  }

  const uploadFile = async () => {
    setLoading(true)

    const data = new FormData()
    data.append("file", file)
    data.append("comment", comment)
    // data.append("type", type)

    try {
      const response = await axios.post(`/file-upload`, data, {
        headers: {
          "Content-Type": "mulpipart/form-data",
        },
      })

      const secondRequestData = {
        comment,
        file_name: file.name,
        region_id: regionId,
        type,
        url: response.file_url,
      }

      await axios.post("/region/region-file", secondRequestData)
      setUpdater((prev) => prev + 1)
      removeFile()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

    // axios
    //   .post(`/region/${regionId}/upload`, data, {
    //     headers: {
    //       "Content-Type": "mulpipart/form-data",
    //     },
    //   })
    //   .then((res) => {
    //     console.log("res ===> ", res)
    //   })
    //   .then((res) => {
    //     removeFile()
    //   })
    //   .finally(() => setLoading(false))
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className="upload-with-comment">
      <div {...getRootProps()} className="dropzone" style={{ height: 164 }}>
        <input {...getInputProps()} />
        <MoveToInboxIcon style={{ fontSize: "50px" }} />
        <p className="title">
          <h1>Faylni yuklang</h1>
        </p>
      </div>

      {file && (
        <div className="files-list">
          <div className="file-item">
            <div className="file-title">
              <div>
                <SvgIcon name="document" />
              </div>
              <p className="filename truncate" title={file.name}>
                {file.name}
              </p>
            </div>

            <Input
              placeholder={"Izoh"}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="remove-btn" onClick={removeFile}>
              <SvgIcon name="close" />
            </div>
          </div>

          <div className="btn-row">
            <Button loading={loading} onClick={uploadFile} color="primary">
              {t("save")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SingleUploadWithComment
