import { Add, FileOpen } from "@mui/icons-material"
import { Menu, Tooltip } from "@mui/material"
import { useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import constructorObjectService from "../../../../services/constructorObjectService"
import { generateGUID } from "../../../../utils/generateID"
import styles from "./style.module.scss"

const DocumentGeneratorButton = () => {
  const navigate = useNavigate()
  const { appId, tableSlug, id: objectId } = useParams()
  const [anchorEl, setAnchorEl] = useState(null)

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const { data: {templates, templateFields} = {templates: [] , templateFields: []} } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug],
    () => {
      return constructorObjectService.getList("template", {
        data: { table_slug: tableSlug,  [getFilteredData?.slug]: objectId ?? undefined},
      })
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

  const navigateToDocumentEditPage = (template) => {
    const state = {
      toDocsTab: true,
      template: template,
      objectId: objectId,
    }

    closeMenu()
    navigate(`/main/${appId}/object/${tableSlug}`, { state })
  }

  const navigateToDocumentCreatePage = () => {
    const state = {
      toDocsTab: true,
      template: {
        id: generateGUID(),
        title: "NEW",
        type: "CREATE",
        table_slug: tableSlug,
        html: "",
        objectId
      },
    }
    closeMenu()
    navigate(`/main/${appId}/object/${tableSlug}`, { state })
  }

  return (
    <>
      <Tooltip title="Generate document">
        <RectangleIconButton color="white" onClick={openMenu}>
          <FileOpen />
        </RectangleIconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          {templates?.map((template, index) => (
            <div
              key={template.id}
              className={`${styles.menuItem}`}
              onClick={() => navigateToDocumentEditPage(template)}
            >
              <p className={styles.itemText}>{template.title}</p>
            </div>
          ))}
          <div
            className={`${styles.menuItem}`}
            onClick={() => navigateToDocumentCreatePage()}
          >
            <Add color="primary" />
            <p className={styles.itemText}> Create new</p>
          </div>
        </div>
      </Menu>
    </>
  )
}

export default DocumentGeneratorButton
