import edjsParser from "editorjs-parser"
import { useState } from "react"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import CancelButton from "../../../components/Buttons/CancelButton"
import SaveButton from "../../../components/Buttons/SaveButton"
import Footer from "../../../components/Footer"
import HFAutoWidthInput from "../../../components/FormElements/HFAutoWidthInput"
import PageFallback from "../../../components/PageFallback"
import documentTemplateService from "../../../services/documentTemplateService"
import request from "../../../utils/request"
import Redactor from "./Redactor"
import styles from "./style.module.scss"

const parser = new edjsParser()

const RedactorBlock = ({
  selectedTemplate,
  setSelectedTemplate,
  updateTemplate,
  addNewTemplate,
}) => {
  const { control, handleSubmit, reset } = useForm()
  const editorCore = useRef(null)
  const [loader, setLoader] = useState(false)
  const [btnLoader, setBtnLoader] = useState(false)

  useEffect(() => {
    setLoader(true)

    reset({
      ...selectedTemplate,
      html: selectedTemplate.html ? JSON.parse(selectedTemplate.html) : [],
    })

    setTimeout(() => {
      setLoader(false)
    })
  }, [selectedTemplate, reset])

  const onSubmit = async (values) => {
    try {
      setBtnLoader(true)

      const savedData = await editorCore.current.save()

      const data = {
        ...values,
        html: savedData ? JSON.stringify(savedData) : "",
      }

      if (values.type !== "CREATE") {
        await documentTemplateService.update(data)
        updateTemplate(data)
      } else {
        const res = await documentTemplateService.create(data)
        addNewTemplate(res)
      }

      setSelectedTemplate(null)
    } catch (error) {
      console.log(error)
      setBtnLoader(false)
    }
  }

  if (loader) return <div className={styles.redactorBlock} />

  return (
    <div className={styles.redactorBlock}>
      <div className={styles.pageBlock}>
        <div>
          <HFAutoWidthInput
            control={control}
            name="title"
            inputStyle={{ fontSize: 20 }}
          />
        </div>

        <div className={styles.pageSize}>A4 (595 x 842)</div>

        <Redactor ref={editorCore} control={control} />
      </div>

      <Footer
        extra={
          <>
            <CancelButton onClick={() => setSelectedTemplate(null)} />{" "}
            <SaveButton loading={btnLoader} onClick={handleSubmit(onSubmit)} />{" "}
          </>
        }
      />
    </div>
  )
}

export default RedactorBlock
