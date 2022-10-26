import { Add } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { generateID } from "../../../utils/generateID"
import styles from "./style.module.scss"

const TemplatesList = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  templateFields,
}) => {
  const { tableSlug } = useParams()
  const { t } = useTranslation()

  const onCreateButtonClick = () => {
    const data = {
      id: generateID(),
      title: "NEW",
      type: "CREATE",
      table_slug: tableSlug,
      html: "",
    }
    setSelectedTemplate(data)
  }

  return (
    <div className={styles.docListBlock}>
      <div className={styles.doclistHeader}>
        <div className={styles.doclistHeaderTitle}>{t("templates")}</div>
        <IconButton onClick={onCreateButtonClick}>
          <Add />
        </IconButton>
      </div>

      <div className={styles.docList}>
        {templates?.map((template) => (
          <div
            key={template.id}
            className={`${styles.row} ${
              selectedTemplate?.guid === template.guid ? styles.active : ""
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            {template.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TemplatesList
