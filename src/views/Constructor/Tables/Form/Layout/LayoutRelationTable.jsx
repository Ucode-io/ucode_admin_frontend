import { useMemo } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import DataTable from "../../../../../components/DataTable"
import constructorObjectService from "../../../../../services/constructorObjectService"

const LayoutRelationTable = ({ relation }) => {
  const { slug } = useParams()

  const relatedTableSlug = useMemo(() => {
    const computedRelation = relation?.relation

    return computedRelation?.table_from === slug
      ? computedRelation?.table_to
      : computedRelation?.table_from
  }, [relation, slug])

  const { data: columns ,isLoading: dataFetchingLoading } = useQuery(
    ["GET_VIEW_RELATION_FIELDS", relatedTableSlug],
    () => {
      return constructorObjectService.getList(relatedTableSlug, {
        data: { limit: 0, offset: 0 },
      })
    },
    {
      select: (res) => {
        return res?.data?.fields ?? []
      },
    }
  )

  return (
    <DataTable
      removableHeight={false}
      loader={dataFetchingLoading}
      data={[]}
      columns={columns}
      pagesCount={1}
      currentPage={1}
      // onRowClick={navigateToEditPage}
      // onDeleteClick={deleteHandler}
      disableFilters
      // onPaginationChange={setCurrentPage}
    />
  )
}

export default LayoutRelationTable
