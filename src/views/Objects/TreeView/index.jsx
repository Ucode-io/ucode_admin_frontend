import { useEffect, useMemo } from "react"
import { useState } from "react"
import PageFallback from "../../../components/PageFallback"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import RecursiveBlock from "./RecursiveBlock"

const TreeView = ({
  computedColumns,
  tableSlug,
  setViews,
  filters,
  filterChangeHandler,
  groupField,
  group,
  view
}) => {
  const [tableLoader, setTableLoader] = useState(true)
  const [data, setData] = useState([])

  const parentElements = useMemo(() => {
    return data.filter((row) => !row[`${tableSlug}_id`])
  }, [data, tableSlug])

  const getAllData = async () => {
    setTableLoader(true)
    try {

      let groupFieldName = ''

      if(groupField?.id?.includes('#')) groupFieldName = `${groupField.id.split('#')[0]}_id`
      if(groupField?.slug) groupFieldName = groupField?.slug

      const { data } = await constructorObjectService.getList(tableSlug, {
        data: { offset: 0, limit: 1000, [groupFieldName]: group?.value },
      })

      setViews(data.views ?? [])
      setData(objectToArray(data.response ?? {}))
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
            />
          ))}
        </>
      )}
    </div>
  )
}

export default TreeView
