import { useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import FiltersBlock from "../../../components/FiltersBlock"
import documentTemplateService from "../../../services/documentTemplateService"

import ViewTabSelector from "../components/ViewTypeSelector"
import DocSettingsBlock from "./DocSettingsBlock"
import RedactorBlock from "./RedactorBlock"
import styles from "./style.module.scss"
import TemplatesList from "./TemplatesList"

const DocView = ({
  view,
  views,
  fieldsMap,
  selectedTabIndex,
  setSelectedTabIndex,
}) => {
  const { tableSlug } = useParams()
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedSettingsTab, setSelectedSettingsTab] = useState(0)

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

  const addNewTemplate = (template) => {
    setTemplates((prev) => {
      return [...prev, template]
    })
  }

  return (
    <div>
      <FiltersBlock>
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
        />
      </FiltersBlock>

      <div className={styles.mainBlock}>
        <TemplatesList
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
        {selectedTemplate ? (
          <RedactorBlock
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            updateTemplate={updateTemplate}
            addNewTemplate={addNewTemplate}
          />
        ) : (
          <div className={styles.redactorBlock} />
        )}
        <DocSettingsBlock />
      </div>
    </div>
  )
}

export default DocView
