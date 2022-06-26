import { FilterAlt } from "@mui/icons-material"
import { useEffect, useMemo } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import CreateButton from "../../../components/Buttons/CreateButton"
import FiltersBlockButton from "../../../components/Buttons/FiltersBlockButton"
import FiltersBlock from "../../../components/FiltersBlock"
import PageFallback from "../../../components/PageFallback"
import SearchInput from "../../../components/SearchInput"
import TableCard from "../../../components/TableCard"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import ViewTabSelector from "../components/ViewTypeSelector"
import RecursiveBlock from "./RecursiveBlock"

const TreeView = ({
  computedColumns,
  views,
  setViews,
  isRelation,
  tableInfo,
  selectedTabIndex,
  setSelectedTabIndex,
  view,
}) => {
  const { tableSlug } = useParams()
  const { navigateToForm } = useTabRouter()
  const [tableLoader, setTableLoader] = useState(true)
  const [data, setData] = useState([])

  const parentElements = useMemo(() => {
    return data.filter((row) => !row[`${tableSlug}_id`])
  }, [data, tableSlug])

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug)
  }

  const getAllData = async () => {
    setTableLoader(true)
    try {
      const { data } = await constructorObjectService.getList(tableSlug, {
        data: { offset: 0, limit: 1000 },
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
      <FiltersBlock>
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          setViews={setViews}
        />
        <SearchInput />
        <FiltersBlockButton>
          <FilterAlt color="primary" />
          Быстрый фильтр
        </FiltersBlockButton>
      </FiltersBlock>

      {tableLoader ? (
        <PageFallback />
      ) : (
        <TableCard
          width={740}
          extra={<CreateButton onClick={navigateToCreatePage} />}
        >
          {parentElements?.map((row) => (
            <RecursiveBlock
              key={row.guid}
              row={row}
              view={view}
              data={data}
              setData={setData}
            />
          ))}
        </TableCard>
      )}
    </div>
  )
}

export default TreeView
