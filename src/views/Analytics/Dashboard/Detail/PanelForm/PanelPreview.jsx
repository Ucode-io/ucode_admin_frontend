import { useMemo } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import DataTable from "../../../../../components/DataTable"
import request from "../../../../../utils/request"
import styles from "./style.module.scss"

const PanelPreview = ({ form }) => {
  const {panelId} = useParams()

  const title = form.watch('title')
    
  const { data, isLoading } = useQuery(
    ["GET_DATA_BY_QUERY_IN_PREVIEW", panelId, title],
    () => {
      const query = form.getValues('query')
      if(!query) return []
      return request.post("/query", {
        data: {},
        query: query,
      })
    }
  )

  const columns = useMemo(() => {
    if (!data?.rows?.length) return []

    return Object.keys(data.rows[0])?.map((key) => ({
      id: key,
      label: key,
      slug: key,
    }))
  }, [data])

  

  return (
    <div className={styles.panel}>
      <div className={styles.title}>{title}</div>

      <DataTable
        loader={isLoading}
        data={data?.rows}
        columns={columns}
        disablePagination
        removableHeight={"auto"}
        disableFilters
        wrapperStyle={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 10,
        }}
        tableStyle={{ flex: 1 }}
      />
    </div>
  )
}

export default PanelPreview
