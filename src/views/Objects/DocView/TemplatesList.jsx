import { Add } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useParams } from "react-router-dom"
import { generateID } from "../../../utils/generateID"
import styles from "./style.module.scss"

const TemplatesList = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
}) => {
  const { tableSlug } = useParams()

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
        <div className={styles.doclistHeaderTitle}>Шаблоны</div>
        <IconButton onClick={onCreateButtonClick} >
          <Add />
        </IconButton>
      </div>

      <div className={styles.docList}>
        {templates?.map((template) => (
          <div
            key={template.id}
            className={`${styles.row} ${selectedTemplate?.id === template.id ? styles.active : ''}`}
            onClick={() => setSelectedTemplate(template)}
          >
            {template.title}
          </div>
        ))}



        {/* <div className={styles.row}>Рецепты</div>
        <div className={styles.row}>Выписка доктора</div> */}
      </div>
    </div>
  )
}

export default TemplatesList
