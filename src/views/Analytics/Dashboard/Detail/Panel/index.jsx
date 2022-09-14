import { Delete, Edit } from "@mui/icons-material"
import { useMemo, useState } from "react"
import { useMutation, useQuery } from "react-query"
import { useLocation, useNavigate } from "react-router-dom"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import DataTable from "../../../../../components/DataTable"
import DeleteWrapperModal from "../../../../../components/DeleteWrapperModal"
import panelService from "../../../../../services/analytics/panelService"
import request from "../../../../../utils/request"
import styles from "./style.module.scss"

const Panel = ({
  panel = {},
  layoutIsEditable,
  variablesValue = {},
  refetch,
}) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery(
    ["GET_DATA_BY_QUERY", panel.query, variablesValue, currentPage],
    () => {

      const computedData = variablesValue

      if(panel.has_pagination) {
        computedData.offset = (currentPage - 1) * 10
        computedData.limit = 10
      }

      return request.post("/query", {
        data: variablesValue,
        query: panel.query,
      })
    }
  )
     
  const { mutate: deletePanel, isLoading: deleteLoading } = useMutation(
    () => {
      return panelService.delete(panel.id)
    },
    {
      onSuccess: () => {
        refetch()
      },
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

        {layoutIsEditable && (
          <div className={styles.btnsBlock}>
            <RectangleIconButton
              className={styles.editButton}
              onClick={navigateToEditPage}
            >
              <Edit color="primary" />
            </RectangleIconButton>

            <DeleteWrapperModal onDelete={deletePanel}>
              <RectangleIconButton
                className={styles.editButton}
                onClick={navigateToEditPage}
                loader={deleteLoading}
                color="error"
              >
                <Delete color="error" />
              </RectangleIconButton>
            </DeleteWrapperModal>
          </div>
        )}
      </div>



      <DataTable
        loader={isLoading}
        data={data?.rows}
        columns={columns}
        disablePagination={!panel.has_pagination}
        removableHeight={null}
        disableFilters
        wrapperStyle={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 10,
          height: "100px",
        }}
        tableStyle={{ flex: 1 }}
      />
    </div>
  )
}

export default Panel
