import { BackupTable } from "@mui/icons-material"
import edjsParser from "editorjs-parser"
import { useRef, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import documentTemplateService from "../../../services/documentTemplateService"
import DocumentSettingsTypeSelector from "../components/DocumentSettingsTypeSelector"

import ViewTabSelector from "../components/ViewTypeSelector"
import TableView from "../TableView"
import DocSettingsBlock from "./DocSettingsBlock"
import RedactorBlock from "./RedactorBlock"
import styles from "./style.module.scss"
import TemplatesList from "./TemplatesList"

const parser = new edjsParser()

const DocView = ({
  views,
  selectedTabIndex,
  setSelectedTabIndex,
  fieldsMap,
}) => {
  const redactorRef = useRef()
  const { tableSlug } = useParams()
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedSettingsTab, setSelectedSettingsTab] = useState(0)
  const [pdfLoader, setPdfLoader] = useState(false)
  const [tableViewIsActive, setTableViewIsActive] = useState(false)
  const [selectedObject, setSelectedObject] = useState(null)

  const view = views.find((view) => view.type === "TABLE")

  const { isLoading } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug],
    () => {
      return documentTemplateService.getList({ table_slug: tableSlug })
    },
    {
      onSuccess: (res) => setTemplates(res.htmlTemplates ?? []),
    }
  )

  const updateTemplate = (template) => {
    setTemplates((prev) => {
      return prev.map((t) => {
        if (t.id === template.id) {
          return template
        }
        return t
      })
    })
  }

  const exportToHtml = async () => {
    if (!selectedTemplate) return
    setPdfLoader(true)

    try {
      const savedData = await redactorRef.current.save()

      const res = await documentTemplateService.exportToPDF({
        data: {
          table_slug: tableSlug,
          object_id: selectedObject,
        },
        html: savedData ? parser.parse(savedData)?.replaceAll('&lt;', '<')?.replaceAll('&gt;', '>') : "",
      })

      window.open(res.link, { target: "_blank" })
    } finally {
      setPdfLoader(false)
    }
  }

  const addNewTemplate = (template) => {
    setTemplates((prev) => {
      return [...prev, template]
    })
  }

  const onCheckboxChange = (val, row) => {
    if (val) setSelectedObject(row.guid)
    else setSelectedObject(null)
  }

  return (
    <div>
      <FiltersBlock
        style={{ padding: 0 }}
        extra={
          <>
            <RectangleIconButton
              color="white"
              onClick={() => setTableViewIsActive((prev) => !prev)}
            >
              <BackupTable color={tableViewIsActive ? "primary" : ""} />
            </RectangleIconButton>

            <DocumentSettingsTypeSelector
              selectedTabIndex={selectedSettingsTab}
              setSelectedTabIndex={setSelectedSettingsTab}
            />
          </>
        }
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
        />
      </FiltersBlock>

      {isLoading ? (
        <PageFallback />
      ) : (
        <div className={styles.mainBlock}>
          <TemplatesList
            templates={templates}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />

          {tableViewIsActive && (
            <div className={styles.redactorBlock}>
              <TableView
                checkboxValue={selectedObject}
                onCheckboxChange={onCheckboxChange}
                isDocView
                filters={{}}
                view={view}
                fieldsMap={fieldsMap}
              />
            </div>
          )}

            
            {selectedTemplate ? (
              <RedactorBlock
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                updateTemplate={updateTemplate}
                addNewTemplate={addNewTemplate}
                ref={redactorRef}
                tableViewIsActive={tableViewIsActive}
              />
            ) : (
              <div className={`${styles.redactorBlock} ${tableViewIsActive ? styles.hidden : ''}`} />
            )}

          <DocSettingsBlock
            exportToHtml={exportToHtml}
            selectedSettingsTab={selectedSettingsTab}
            pdfLoader={pdfLoader}
          />
        </div>
      )}
    </div>
  )
}

export default DocView
