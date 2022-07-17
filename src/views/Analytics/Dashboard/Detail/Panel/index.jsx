import { Edit } from "@mui/icons-material"
import { useMemo } from "react"
import { useQuery } from "react-query"
import { useLocation, useNavigate } from "react-router-dom"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import DataTable from "../../../../../components/DataTable"
import request from "../../../../../utils/request"
import styles from "./style.module.scss"

const Panel = ({ panel = {}, layoutIsEditable, variablesValue = {} }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery(
    ["GET_DATA_BY_QUERY", panel.query, variablesValue],
    () => {
      return request.post("/query", {
        data: variablesValue,
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
  }, [data])

  const navigateToEditPage = (e) => {
    navigate(`${pathname}/panel/${panel.id}`)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.title}>
        <div>{panel.title}</div>
        
        
    

        {layoutIsEditable && <RectangleIconButton className={styles.editButton} onClick={navigateToEditPage} >
          <Edit color="primary" />
        </RectangleIconButton>}
        
      </div>

      <DataTable
        loader={isLoading}
        data={data?.rows}
        columns={columns}
        disablePagination
        removableHeight={null}
        disableFilters
        wrapperStyle={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 10,
          height: '100px',
        }}
        tableStyle={{ flex: 1 }}
      />
    </div>
  )
}

export default Panel
