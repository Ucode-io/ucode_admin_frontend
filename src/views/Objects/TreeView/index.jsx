import { useEffect, useMemo } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import PageFallback from "../../../components/PageFallback"
import constructorObjectService from "../../../services/constructorObjectService"
import FastFilter from "../components/FastFilter"
import RecursiveBlock from "./RecursiveBlock"
import styles from "./style.module.scss"

const TreeView = ({ groupField, fieldsMap, group, view }) => {
  const { tableSlug } = useParams()
  const [tableLoader, setTableLoader] = useState(true)
  const [data, setData] = useState([])

  const parentElements = useMemo(() => {
    return data.filter((row) => !row[`${tableSlug}_id`])
  }, [data, tableSlug])

  const getAllData = async () => {
    setTableLoader(true)
    try {
      let groupFieldName = ""

      if (groupField?.id?.includes("#"))
        groupFieldName = `${groupField.id.split("#")[0]}_id`
      if (groupField?.slug) groupFieldName = groupField?.slug

      const { data } = await constructorObjectService.getList(tableSlug, {
        data: { offset: 0, limit: 10, [groupFieldName]: group?.value },
      })

      setData(data.response ?? [])

      // dispatch(
      //   tableColumnActions.setList({
      //     tableSlug: tableSlug,
      //     columns: data.fields ?? [],
      //   })
      // )
    } finally {
      setTableLoader(false)
    }
  }

  useEffect(() => {
    getAllData()
  }, [])

  return (
    <div>
      {view?.quick_filters?.length > 0 && (
        <div className={styles.filters}>
          <p>Фильтры</p>
          <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
        </div>
      )}
      {tableLoader ? (
        <PageFallback />
      ) : (
        <>
          {parentElements?.map((row) => (
            <RecursiveBlock
              key={row.guid}
              row={row}
              view={view}
              data={data}
              setData={setData}
              fieldsMap={fieldsMap}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default TreeView
