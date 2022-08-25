import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import ObjectDataTable from "../../../components/DataTable/ObjectDataTable"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import { objectToArray } from "../../../utils/objectToArray"
import { pageToOffset } from "../../../utils/pageToOffset"
import styles from "./style.module.scss"

const RelationTable = ({ relation, createFormVisible, setCreateFormVisible }) => {
  const { appId, tableSlug, id } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { navigateToForm } = useTabRouter()
 
  const [currentPage, setCurrentPage] = useState(1)
  const [tableData, setTableData] = useState([])
  const [columns, setColumns] = useState([])
  const [pageCount, setPageCount] = useState(1)

  const { isLoading: dataFetchingLoading } = useQuery(
    [
      "GET_OBJECT_LIST",
      relation.relatedTable,
      tableSlug,
      relation.type,
      currentPage,
      id,
    ],
    () => {
      return constructorObjectService.getList(relation.relatedTable, {
        data: {
          offset: pageToOffset(currentPage, 5),
          limit: 10,
          [`${tableSlug}_${relation.type === "Many2Many" ? "ids" : "id"}`]: id,
        },
      })
    },
    {
      onSuccess: ({ data }) => {
        if (id) {
          setTableData(objectToArray(data.response ?? {}))
          setPageCount(isNaN(data.count) ? 1 : Math.ceil(data.count / 10))
        }

        setColumns(data.fields ?? [])
      },
    }
  )
  
  const { isLoading: deleteLoading, mutate: deleteHandler } = useMutation(
    (row) => {
      if (relation.type === "Many2Many") {
        const data = {
          id_from: id,
          id_to: [row.guid],
          table_from: tableSlug,
          table_to: relation.relatedTable,
        }

        return constructorObjectService.deleteManyToMany(data)
      } else {
        return constructorObjectService.delete(
          relation.relatedTable,
          row.guid
        )
      }
    },
    {
      onSettled: () => {
        queryClient.refetchQueries([
          "GET_OBJECT_LIST",
          relation.relatedTable,
        ])
      },
    }
  )

  const tableLoader = deleteLoading || dataFetchingLoading

  const navigateToEditPage = (row) => {
    navigateToForm(relation.relatedTable, "EDIT", row)
  }

  const navigateToTablePage = () => {
    navigate(`/main/${appId}/object/${relation.relatedTable}`, {
      state: { [`${tableSlug}_${relation.type === "Many2Many" ? "ids" : "id"}`]: id }
    })
  }

  const { mutateAsync } = useMutation((values) => {
    if(values.guid) return constructorObjectService.update(relation.relatedTable, { data: values })
    else constructorObjectService.create(relation.relatedTable, { data: values })
  }, {
    onSuccess: () => {
      setCreateFormVisible(false)
      queryClient.refetchQueries([
        "GET_OBJECT_LIST",
        relation.relatedTable,
      ])
    }
  })

  const onFormSubmit = (values) => {
    return mutateAsync(values)
  }

  return (
    <div className={styles.cardBody} >
      <ObjectDataTable
        removableHeight={false}
        loader={tableLoader}
        data={tableData}
        columns={columns}
        func={relation?.summaries?.length > 0 ? relation?.summaries : null}
        pagesCount={pageCount}
        currentPage={currentPage}
        onRowClick={navigateToEditPage}
        onDeleteClick={deleteHandler}
        disableFilters
        onPaginationChange={setCurrentPage}
        paginationExtraButton={id && <SecondaryButton onClick={navigateToTablePage} >Все</SecondaryButton>}
        onFormSubmit={onFormSubmit}
        createFormVisible={createFormVisible[relation.id]}
        setCreateFormVisible={(val) => setCreateFormVisible(relation.id, val)}
      />
    </div>
  )
}

export default RelationTable
