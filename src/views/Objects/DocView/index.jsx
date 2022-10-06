import { BackupTable, ImportExport } from "@mui/icons-material"
import { useMemo, useRef, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { useLocation, useParams } from "react-router-dom"
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import usePaperSize from "../../../hooks/usePaperSize"
import constructorObjectService from "../../../services/constructorObjectService"
import constructorRelationService from "../../../services/constructorRelationService"
import constructorViewRelationService from "../../../services/constructorViewRelationService"
import documentTemplateService from "../../../services/documentTemplateService"
import DocumentSettingsTypeSelector from "../components/DocumentSettingsTypeSelector"

import ViewTabSelector from "../components/ViewTypeSelector"
import RelationSection from "../RelationSection"
import TableView from "../TableView"
import DocRelationsSection from "./DocRelationsSection"
import DocSettingsBlock from "./DocSettingsBlock"
import RedactorBlock from "./RedactorBlock"
import styles from "./style.module.scss"
import TemplatesList from "./TemplatesList"

const DocView = ({
  views,
  selectedTabIndex,
  setSelectedTabIndex,
  fieldsMap,
}) => {
  const redactorRef = useRef()
  const { state } = useLocation()
  const { tableSlug } = useParams()
  const queryClient = useQueryClient()

  const view = views.find((view) => view.type === "TABLE")

  // =====SETTINGS BLOCK=========
  const [pdfLoader, setPdfLoader] = useState(false)
  const [htmlLoader, setHtmlLoader] = useState(false)
  const [selectedSettingsTab, setSelectedSettingsTab] = useState(1)
  const [tableViewIsActive, setTableViewIsActive] = useState(false)
  const [relationViewIsActive, setRelationViewIsActive] = useState(false)
  const [selectedPaperSizeIndex, setSelectedPaperSizeIndex] = useState(0)

  const { selectedPaperSize } = usePaperSize(selectedPaperSizeIndex)
  
  
  const [selectedObject, setSelectedObject] = useState(state?.template?.objectId ?? null)
  const [selectedTemplate, setSelectedTemplate] = useState(
    state?.template ?? null
    )

  // ========FIELDS FOR RELATIONS=========
  const { data: fields = [] } = useQuery(
    ["GET_OBJECTS_LIST_WITH_RELATIONS", { tableSlug, limit: 0, offset: 0 }],
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

        return [...fields, ...relationFields]?.filter(
          (el) => el.type !== "LOOKUP"
        )
      },
    }
  )

  // ========GET TEMPLATES LIST===========
  const { data: {templates , templateFields} = {templates: [] , templateFields: []}, isLoading, refetch } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug],
    () => {
      return constructorObjectService.getList('template', { data: {table_slug: tableSlug, [getFilteredData?.slug]: selectedObject ?? undefined} })
    },
    {
      select: ({data}) =>{
        const templates = data?.response ?? []
        const templateFields = data?.fields ?? []
        
        return {
          templates,templateFields
        }
      } ,
    }
  )
  const getFilteredData = useMemo(() => {
    return templateFields.filter((item) => item?.type === 'LOOKUP' || item?.type === 'LOOKUPS').find((i) => i.table_slug === tableSlug)
  }, [templateFields, tableSlug])
  console.log('getFilteredData', getFilteredData)

  // ========UPDATE TEMPLATE===========

  const updateTemplate = (template) => {
    refetch()
  }

  // ========ADD NEW TEMPLATE=========
  const addNewTemplate = (template) => {
    refetch()
  }

  // =========CHECKBOX CHANGE HANDLER=========
  const onCheckboxChange = (val, row) => {
    if (val) setSelectedObject(row.guid)
    else setSelectedObject(null)
  }

  // =======EXPORT TO PDF============

  const exportToPDF = async () => {
    if (!selectedTemplate) return
    setPdfLoader(true)

    try {
      let html = redactorRef.current.getData()

      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head>`

      fields.forEach((field) => {
        html = html.replaceAll(
          `{ ${field.label} }`,
          `<%= it.${field.path_slug ?? field.slug} %>`
        )
      })

      const res = await documentTemplateService.exportToPDF({
        data: {
          table_slug: tableSlug,
          object_id: selectedObject,
          page_size: selectedPaperSize.name,
        },
        html: meta + html,
      })

      queryClient.refetchQueries([
        "GET_OBJECT_FILES",
        { tableSlug, selectedObject },
      ])

      window.open(res.link, { target: "_blank" })
    } finally {
      setPdfLoader(false)
    }
  }

  // ========EXPORT TO HTML===============

  const exportToHTML = async () => {
    if (!selectedTemplate) return
    setHtmlLoader(true)

    try {
      let html = redactorRef.current.getData()
      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head>`

      fields.forEach((field) => {
        html = html.replaceAll(
          `{ ${field.label} }`,
          `<%= it.${field.path_slug ?? field.slug} %>`
        )
      })

      const res = await documentTemplateService.exportToHTML({
        data: {
          table_slug: tableSlug,
          object_id: selectedObject,
        },
        html: meta + html,
      })

      setSelectedTemplate((prev) => ({
        ...prev,
        html: res.html,
        size: [selectedPaperSize?.name],
      }))
    } finally {
      setHtmlLoader(false)
    }
  }

  // =======PRINT============

  const print = async () => {
    if (!selectedTemplate) return
    setPdfLoader(true)

    try {
      let html = redactorRef.current.getData()

      const meta = `<head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head>`

      fields.forEach((field) => {
        html = html.replaceAll(
          `{ ${field.label} }`,
          `<%= it.${field.path_slug ?? field.slug} %>`
        )
      })

      const computedHTML = `${meta} ${html} `

      // printJS({ printable: computedHTML, type: 'raw-html', style: [
      //   `@page { size: ${selectedPaperSize.width}pt ${selectedPaperSize.height}pt; margin: 5mm;} body { margin: 0 }`
      // ],
      // targetStyles: ["*"] })
    } finally {
      setPdfLoader(false)
    }
  }

  return (
    <div>
      <FiltersBlock
        style={{ padding: 0 }}
        extra={
          <>
            <RectangleIconButton
              color="white"
              onClick={() => setRelationViewIsActive((prev) => !prev)}
            >
              <ImportExport
                style={{ transform: "rotate(45deg)" }}
                color={relationViewIsActive ? "primary" : ""}
              />
            </RectangleIconButton>

            {/* <DocRelationsButton /> */}
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
                isChecked={(row) => selectedObject === row.guid}
                onCheckboxChange={onCheckboxChange}
                isDocView
                filters={{}}
                view={view}
                fieldsMap={fieldsMap}
              />
            </div>
          )}

          {relationViewIsActive && <div className={styles.redactorBlock}>
            <DocRelationsSection />
          </div>}

         {!relationViewIsActive &&  <>
          {selectedTemplate ? (
            <RedactorBlock
            templateFields={templateFields}
            selectedObject={selectedObject}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              updateTemplate={updateTemplate}
              addNewTemplate={addNewTemplate}
              ref={redactorRef}
              tableViewIsActive={tableViewIsActive}
              fields={fields}
              selectedPaperSizeIndex={selectedPaperSizeIndex}
              setSelectedPaperSizeIndex={setSelectedPaperSizeIndex}
              htmlLoader={htmlLoader}
              exportToHTML={exportToHTML}
              exportToPDF={exportToPDF}
              pdfLoader={pdfLoader}
              print={print}
            />
          ) : (
            <div
              className={`${styles.redactorBlock} ${
                tableViewIsActive ? styles.hidden : ""
              }`}
            />
          )}
          </>}

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
