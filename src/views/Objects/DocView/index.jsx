import { BackupTable } from "@mui/icons-material"
import edjsParser from "editorjs-parser"
import { useRef, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import usePaperSize from "../../../hooks/usePaperSize"
import constructorObjectService from "../../../services/constructorObjectService"
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
  const [htmlLoader, setHtmlLoader] = useState(false)
  const [tableViewIsActive, setTableViewIsActive] = useState(false)
  const [selectedObject, setSelectedObject] = useState(null)
  const [selectedPaperSizeIndex, setSelectedPaperSizeIndex] = useState(0)
  const [HTMLContent, setHTMLContent] = useState(null)
  const { selectedPaperSize } = usePaperSize(selectedPaperSizeIndex)

  const view = views.find((view) => view.type === "TABLE")

  const { data: fields = [] } = useQuery(
    ['GET_OBJECTS_LIST_WITH_RELATIONS', { tableSlug, limit: 0, offset: 0 }], 
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { with_relations: true, limit: 0, offset: 0 },
      })
    },
    {
      select: (res) => {
        const fields = res.data?.fields ?? []
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? []

          return [...fields, ...relationFields]?.filter(el => el.type !== "LOOKUP")
      }
    }
  )
  

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
 
  const exportToPDF = async () => {
    if (!selectedTemplate) return
    setPdfLoader(true)

    try {
      const savedData = await redactorRef.current.save()
    
      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head>`

      let parsedHTML = parser.parse(savedData)

      fields.forEach(field => {
        parsedHTML = parsedHTML.replaceAll(`{ ${field.label} }`, `<%= it.${field.path_slug ?? field.slug} %>`)
      })

      const res = await documentTemplateService.exportToPDF({
        data: {
          table_slug: tableSlug,
          object_id: selectedObject,
          page_size: selectedPaperSize.name
        },
        html: meta + parsedHTML,
      })

      window.open(res.link, { target: "_blank" })
    } finally {
      setPdfLoader(false)
    }
  }

  const exportToHTML = async () => {
    if (!selectedTemplate) return
    setHtmlLoader(true)

    try {
      const savedData = await redactorRef.current.save()
    
      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head>`


      let parsedHTML = parser.parse(savedData)


      fields.forEach(field => {
        parsedHTML = parsedHTML.replaceAll(`{ ${field.label} }`, `<%= it.${field.path_slug ?? field.slug} %>`)
      })

      const res = await documentTemplateService.exportToHTML({
        data: {
          table_slug: tableSlug,
          object_id: selectedObject,
        },
        html: meta + parsedHTML,
      })

      setHTMLContent(res.html)
    } finally {
      setHtmlLoader(false)
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
                fields={fields}
                selectedPaperSizeIndex={selectedPaperSizeIndex}
                setSelectedPaperSizeIndex={setSelectedPaperSizeIndex}
                HTMLContent={HTMLContent}
                setHTMLContent={setHTMLContent}
                htmlLoader={htmlLoader}
              />
            ) : (
              <div className={`${styles.redactorBlock} ${tableViewIsActive ? styles.hidden : ''}`} />
            )}

          <DocSettingsBlock
            pdfLoader={pdfLoader}
            htmlLoader={htmlLoader}
            exportToPDF={exportToPDF}
            exportToHTML={exportToHTML}
            selectedSettingsTab={selectedSettingsTab}
            selectedPaperSizeIndex={selectedPaperSizeIndex}
            setSelectedPaperSizeIndex={setSelectedPaperSizeIndex}
          />
        </div>
      )}
    </div>
  )
}

export default DocView
