import { useMemo } from "react"
import { useQuery } from "react-query"
import DataTable from "../../../../../components/DataTable"
import request from "../../../../../utils/request"
import styles from "./style.module.scss"

const Panel = ({ panel = {} }) => {
  const { data, isLoading } = useQuery(
    ["GET_DATA_BY_QUERY", panel.query],
    () => {
      return request.post("/query", {
        data: {},
        query: panel.query,
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
  })

  return (
    <div className={styles.panel}>
      <div className={styles.title}>{panel.title}</div>

      <DataTable
        loader={isLoading}
        data={data?.rows}
        columns={columns}
        disablePagination
        removableHeight={"auto"}
        disableFilters
        wrapperStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 10 }}
        tableStyle={{ flex: 1 }}
      />
    </div>
  )
}

export default Panel
