import { Add } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { format } from "date-fns"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import useTabRouter from "../../../hooks/useTabRouter"
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel"
import styles from "./style.module.scss"

const DataBlock = ({ computedData, date, view, fieldsMap, tab }) => {
  const {tableSlug} = useParams()
  const data = computedData[format(date, "dd.MM.yyyy")]
  const { navigateToForm } = useTabRouter()


  const viewFields = useMemo(() => {
    if (!data) return []

    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el)
  }, [data, view, fieldsMap])


  const navigateToEditPage = () => {
    if(!data) return
    navigateToForm(tableSlug, "EDIT", data)
  }

  const navigateToCreatePage = () => {
    const startTimeStampSlug = view?.calendar_from_slug

    navigateToForm(tableSlug, "CREATE", null, {
      [startTimeStampSlug]: date,
      [tab?.slug]: tab?.value,
    })
  }

  return (
    <div className={`${styles.dataBlock} ${data ? styles.hasData : ''}`} onClick={navigateToEditPage} >
      {data ? (
        <div>
          {viewFields?.map((field) => (
            <div>
              <b>{field.label}: </b>
              {field.type === "LOOKUP"
                ? getRelationFieldTableCellLabel(field, data, field.table_slug)
                : data[field.slug]}
            </div>
          ))}
        </div>
      ) : (
        <IconButton className={styles.addButton} onClick={navigateToCreatePage} >
          <Add />
        </IconButton>
      )}
    </div>
  )
}

export default DataBlock
