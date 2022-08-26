import { forwardRef, useState } from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import CancelButton from "../../../components/Buttons/CancelButton"
import SaveButton from "../../../components/Buttons/SaveButton"
import Footer from "../../../components/Footer"
import HFAutoWidthInput from "../../../components/FormElements/HFAutoWidthInput"
import usePaperSize from "../../../hooks/usePaperSize"
import documentTemplateService from "../../../services/documentTemplateService"
import Redactor from "./Redactor"
import styles from "./style.module.scss"


const RedactorBlock = forwardRef(
  ({
    selectedTemplate,
    setSelectedTemplate,
    updateTemplate,
    addNewTemplate,
    tableViewIsActive,
    fields,
    selectedPaperSizeIndex,
    setSelectedPaperSizeIndex,
    HTMLContent,
    setHTMLContent,
    htmlLoader
  }, redactorRef) => {
    const { control, handleSubmit, reset } = useForm()
    const [loader, setLoader] = useState(false)
    const [btnLoader, setBtnLoader] = useState(false)
    const { selectedPaperSize, selectPaperIndexBySize } = usePaperSize(selectedPaperSizeIndex)

    useEffect(() => {
      setLoader(true)

      reset({
        ...selectedTemplate,
        html: selectedTemplate.html ? JSON.parse(selectedTemplate.html) : [],
      })

      setHTMLContent(null)
      setSelectedPaperSizeIndex(selectPaperIndexBySize(selectedTemplate.size))

      setTimeout(() => {
        setLoader(false)
      })
    }, [selectedTemplate, reset])

    const onSubmit = async (values) => {
      try {
        setBtnLoader(true)

        const savedData = await redactorRef.current.save()

        const data = {
          ...values,
          html: savedData ? JSON.stringify(savedData) : "",
          size: [selectedPaperSize.width?.toString(), selectedPaperSize.height?.toString()]
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

    if (loader || htmlLoader) return <div className={styles.redactorBlock} />

    return (
      <div className={`${styles.redactorBlock} ${tableViewIsActive ? styles.hidden : ''}`}>
        <div className={styles.pageBlock} style={{ width: selectedPaperSize.width + 'pt' }} >
          <div>
            <HFAutoWidthInput
              control={control}
              name="title"
              inputStyle={{ fontSize: 20 }}
            />
          </div>

          <div className={styles.pageSize}>{selectedPaperSize.name} ({selectedPaperSize.width} x {selectedPaperSize.height})</div>

          <Redactor ref={redactorRef} control={control} fields={fields} HTMLContent={HTMLContent} />
        </div>

        <Footer
          extra={
            <>
              <CancelButton onClick={() => setSelectedTemplate(null)} />
              <SaveButton
                loading={btnLoader}
                onClick={handleSubmit(onSubmit)}
              />
            </>
          }
        />
      </div>
    )
  }
)

export default RedactorBlock
