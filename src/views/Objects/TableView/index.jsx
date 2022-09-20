import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "react-query"

import constructorObjectService from "../../../services/constructorObjectService"
import { pageToOffset } from "../../../utils/pageToOffset"
import useTabRouter from "../../../hooks/useTabRouter"
import DataTable from "../../../components/DataTable"
import useFilters from "../../../hooks/useFilters"
import FastFilter from "../components/FastFilter"
import styles from './styles.module.scss'

const TableView = ({
  tab,
  view,
  fieldsMap,
  isDocView,
  ...props
}) => {
  const { navigateToForm } = useTabRouter()
  const { tableSlug } = useParams()

  const { filters, filterChangeHandler } = useFilters(tableSlug, view.id)

  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [deleteLoader, setDeleteLoader] = useState(false)

  const columns = useMemo(() => {
    return view?.columns?.map(el => fieldsMap[el])?.filter(el => el)
  }, [view, fieldsMap])

  const { data: { tableData, pageCount } = { tableData: [], pageCount: 1 }, refetch, isLoading: tableLoader } = useQuery({
    queryKey: ["GET_OBJECTS_LIST", { tableSlug, currentPage, limit, filters: { ...filters, [tab?.slug]: tab?.value } }],
    queryFn: () => {
      return constructorObjectService.getList(tableSlug, {
        data: { offset: pageToOffset(currentPage), limit, ...filters, [tab?.slug]: tab?.value },
      })
    },
    select: (res) => {
      return {
        tableData: res.data?.response ?? [],
        pageCount: isNaN(res.data?.count) ? 1 : Math.ceil(res.data?.count / 10)
      }
    },
  })

  const deleteHandler = async (row) => {

    setDeleteLoader(true)
    try {
      await constructorObjectService.delete(tableSlug, row.guid)
      refetch()
    } finally {
      setDeleteLoader(false)
    }
  }

  const navigateToEditPage = (row) => {
    navigateToForm(tableSlug, "EDIT", row)
  }

  return (
    <div className={styles.wrapper}>
      {
        view?.quick_filters?.length > 0 &&
        <div className={styles.filters}>
          <p>Фильтры</p>
          <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
        </div>
       }
      <DataTable
        removableHeight={isDocView ? 150 : 207}
        currentPage={currentPage}
        pagesCount={pageCount}
        columns={columns}
        setLimit={setLimit}
        onPaginationChange={setCurrentPage}
        loader={tableLoader || deleteLoader}
        data={tableData}
        filters={filters}
        filterChangeHandler={filterChangeHandler}
        onRowClick={navigateToEditPage}
        onDeleteClick={deleteHandler}
        tableSlug={tableSlug}
        tableStyle={{ 
          borderRadius: 0, border: 'none',
          borderBottom: '1px solid #E5E9EB',
          width: view?.quick_filters?.length ? 'calc(100vw - 254px)' : "100%"
        }}
        isResizeble={true}
        {...props}
        />
    </div>
  )
}

export default TableView
