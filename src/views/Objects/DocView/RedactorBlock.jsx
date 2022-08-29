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
  }, redactorRef) => {
    const { control, handleSubmit, reset } = useForm()
    const [btnLoader, setBtnLoader] = useState(false)
    const { selectedPaperSize, selectPaperIndexBySize } = usePaperSize(selectedPaperSizeIndex)

    useEffect(() => {
      reset({
        ...selectedTemplate,
        html: selectedTemplate.html,
      })
      setSelectedPaperSizeIndex(selectPaperIndexBySize(selectedTemplate.size))
    }, [selectedTemplate, reset, setSelectedPaperSizeIndex, selectPaperIndexBySize])

    const onSubmit = async (values) => {

      console.log("REE ", redactorRef.current)

      try {
        setBtnLoader(true)

        const savedData = redactorRef.current.getData()

        const data = {
          ...values,
          html: savedData ?? "",
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

    return (
      <div className={`${styles.redactorBlock} ${tableViewIsActive ? styles.hidden : ''}`}>
        <div className={styles.pageBlock} 
          // style={{ width: selectedPaperSize.width + 'pt' }}
        >
          <div className={styles.templateName} >
            <HFAutoWidthInput
              control={control}
              name="title"
              inputStyle={{ fontSize: 20 }}
            />
          </div>

          <div className={styles.pageSize}>{selectedPaperSize.name} ({selectedPaperSize.width} x {selectedPaperSize.height})</div>

          <Redactor ref={redactorRef} control={control} fields={fields} />
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
