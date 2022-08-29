import { FileOpen } from "@mui/icons-material"
import { Menu, Tooltip } from "@mui/material"
import { useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import CSelect from "../../../../components/CSelect"
import documentTemplateService from "../../../../services/documentTemplateService"
import Form from "./Form"
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


  // const templateOptions = useMemo(() => {
  //   return listToOptions(templates) 
  // }, [ templates ])


  const { data: templates = [] } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug],
    () => {
      return documentTemplateService.getList({ table_slug: tableSlug })
    },
    {
      select: (res) => {
        return res.htmlTemplates ?? []
      },
    }
  )

  const navigateToDocumentEditPage = (template) => {

    const state = {
      toDocsTab: true,
      template: template,
      objectId: objectId
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
          {templates.map((template, index) => (
            <div
              key={template.id}
              className={`${styles.menuItem}`}
              onClick={() => navigateToDocumentEditPage(template)}
            >
              <p className={styles.itemText}>{template.title}</p>
            </div>
          ))}
        </div>

        {/* <Form closeMenu={closeMenu} /> */}
      </Menu>
    </>
  )
}

export default DocumentGeneratorButton
