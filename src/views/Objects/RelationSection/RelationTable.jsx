import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import DataTable from "../../../components/DataTable"
import FRow from "../../../components/FormElements/FRow"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import { listToMap } from "../../../utils/listToMap"
import { objectToArray } from "../../../utils/objectToArray"
import { pageToOffset } from "../../../utils/pageToOffset"
import { Filter } from "../components/FilterGenerator"
import styles from "./style.module.scss"
import ObjectDataTable from "../../../components/DataTable/ObjectDataTable"



const RelationTable = ({
  relation,
  createFormVisible,
  setCreateFormVisible,
}) => {
  const { appId, tableSlug, id } = useParams()
  const navigate = useNavigate()
  const { navigateToForm } = useTabRouter()
  const queryClient = useQueryClient()


  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value ?? undefined,
    })
  }

  const computedRelation = useMemo(() => {
    return {
      ...relation,
      relatedTable:
        relation.table_to?.slug === tableSlug
          ? relation.table_from
          : relation.table_to,
    }
  }, [relation, tableSlug])


  const computedFilters = useMemo(() => {
    const relationFilter = {}

    if(relation.type === "Many2Many") relationFilter[`${tableSlug}_ids`] = id
    else if (relation.type === "Many2Dynamic") relationFilter[`${relation.relation_field_slug}.${tableSlug}_id`] = id
    else relationFilter[`${tableSlug}_id`] = id

    return {
      ...filters,
      ...relationFilter
    }

  }, [ filters, tableSlug, id, relation.type, relation.relation_field_slug ])

  const relatedTableSlug = computedRelation?.relatedTable?.slug

  const { data: { tableData = [], pageCount = 1, columns = [], quickFilters = [] } = {}, isLoading: dataFetchingLoading } = useQuery(
    [
      "GET_OBJECT_LIST",
      relatedTableSlug,
      { filters: computedFilters, offset: pageToOffset(currentPage, limit), limit },
    ],
    () => {
      return constructorObjectService.getList(relatedTableSlug, { data:  {
        offset: pageToOffset(currentPage, limit),
        limit,
        ...computedFilters,
      } })
    },
    {
      select: ({ data }) => {
          const tableData = objectToArray(data.response ?? {})
          const pageCount = isNaN(data.count) ? 1 : Math.ceil(data.count / limit)

          const fieldsMap = listToMap(data.fields)

          const columns = relation.columns?.map((id) => fieldsMap[id])?.filter((el) => el)
          const quickFilters = relation.quick_filters
          ?.map(({ field_id }) => fieldsMap[field_id])
          ?.filter((el) => el)
          return {
            tableData,
            pageCount,
            columns,
            quickFilters
          }
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
          table_to: relatedTableSlug,
        }

        return constructorObjectService.deleteManyToMany(data)
      } else {
        return constructorObjectService.delete(
          relatedTableSlug,
          row.guid
        )
      }
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries([
          "GET_OBJECT_LIST",
          relatedTableSlug,
        ])
      },
    }
  )

  const navigateToEditPage = (row) => {
    navigateToForm(relatedTableSlug, "EDIT", row)
  }

  const navigateToTablePage = () => {
    navigate(`/main/${appId}/object/${relatedTableSlug}`, {
      state: { [`${tableSlug}_${relation.type === "Many2Many" ? "ids" : "id"}`]: id }
    })
  }

  const { mutateAsync } = useMutation((values) => {
    if(values.guid) return constructorObjectService.update(relatedTableSlug, { data: values })
    else constructorObjectService.create(relatedTableSlug, { data: values })
  }, {
    onSuccess: () => {
      setCreateFormVisible(false)
      queryClient.refetchQueries([
        "GET_OBJECT_LIST",
        relatedTableSlug,
      ])
    }
  })

  const onFormSubmit = (values) => {
    return mutateAsync(values)
  }

  return (
    <div className={styles.relationTable}>
      <div className={styles.filtersBlock}>
        {quickFilters?.map((field) => (
          <FRow key={field.id} label={field.label}>
            <Filter
              field={field}
              name={field.slug}
              tableSlug={relatedTableSlug}
              filters={filters}
              onChange={filterChangeHandler}
            />
          </FRow>
        ))}
      </div>

      <div className={styles.tableBlock}>
        <ObjectDataTable
          loader={dataFetchingLoading || deleteLoading}
          data={tableData}
          columns={columns}
          removableHeight={290}
          disableFilters
          pagesCount={pageCount}
          currentPage={currentPage}
          onRowClick={navigateToEditPage}
          
          onDeleteClick={deleteHandler}
          onPaginationChange={setCurrentPage}
          paginationExtraButton={id && <SecondaryButton onClick={navigateToTablePage} >Все</SecondaryButton>}
          onFormSubmit={relation.is_editable && onFormSubmit}
          createFormVisible={createFormVisible[relation.id]}
          setCreateFormVisible={(val) => setCreateFormVisible(relation.id, val)}
          limit={limit}
          onLimitChange={setLimit}
          summaries={relation.summaries}
        />
      </div>
    </div>
  )
}

// const RelationTable = ({ relation, createFormVisible, setCreateFormVisible }) => {
//   console.log("RELATION ===>", relation)

//   const { appId, tableSlug, id } = useParams()
//   const queryClient = useQueryClient()
  // const navigate = useNavigate()
  // const { navigateToForm } = useTabRouter()

//   const [currentPage, setCurrentPage] = useState(1)
//   const [tableData, setTableData] = useState([])
//   const [columns, setColumns] = useState([])
//   const [pageCount, setPageCount] = useState(1)

//   const { isLoading: dataFetchingLoading } = useQuery(
//     [
//       "GET_OBJECT_LIST",
//       relation.relatedTable,
//       tableSlug,
//       relation.type,
//       currentPage,
//       id,
//     ],
//     () => {
//       return constructorObjectService.getList(relation.relatedTable, {
//         data: {
//           offset: pageToOffset(currentPage, 5),
//           limit: 10,
//           [`${tableSlug}_${relation.type === "Many2Many" ? "ids" : "id"}`]: id,
//         },
//       })
//     },
//     {
// onSuccess: ({ data }) => {
//   if (id) {
//     setTableData(objectToArray(data.response ?? {}))
//     setPageCount(isNaN(data.count) ? 1 : Math.ceil(data.count / 10))
//   }

//   setColumns(data.fields ?? [])
// },
//     }
//   )

  // const { isLoading: deleteLoading, mutate: deleteHandler } = useMutation(
  //   (row) => {
  //     if (relation.type === "Many2Many") {
  //       const data = {
  //         id_from: id,
  //         id_to: [row.guid],
  //         table_from: tableSlug,
  //         table_to: relation.relatedTable,
  //       }

  //       return constructorObjectService.deleteManyToMany(data)
  //     } else {
  //       return constructorObjectService.delete(
  //         relation.relatedTable,
  //         row.guid
  //       )
  //     }
  //   },
  //   {
  //     onSettled: () => {
  //       queryClient.refetchQueries([
  //         "GET_OBJECT_LIST",
  //         relation.relatedTable,
  //       ])
  //     },
  //   }
  // )

//   const tableLoader = deleteLoading || dataFetchingLoading

  // const navigateToEditPage = (row) => {
  //   navigateToForm(relation.relatedTable, "EDIT", row)
  // }

  // const navigateToTablePage = () => {
  //   navigate(`/main/${appId}/object/${relation.relatedTable}`, {
  //     state: { [`${tableSlug}_${relation.type === "Many2Many" ? "ids" : "id"}`]: id }
  //   })
  // }

  // const { mutateAsync } = useMutation((values) => {
  //   if(values.guid) return constructorObjectService.update(relation.relatedTable, { data: values })
  //   else constructorObjectService.create(relation.relatedTable, { data: values })
  // }, {
  //   onSuccess: () => {
  //     setCreateFormVisible(false)
  //     queryClient.refetchQueries([
  //       "GET_OBJECT_LIST",
  //       relation.relatedTable,
  //     ])
  //   }
  // })

  // const onFormSubmit = (values) => {
  //   return mutateAsync(values)
  // }

//   return (
//     <div className={styles.cardBody} >
//       <ObjectDataTable
//         removableHeight={false}
//         loader={tableLoader}
//         data={tableData}
//         columns={columns}
//         func={relation?.summaries?.length > 0 ? relation?.summaries : null}
        // pagesCount={pageCount}
        // currentPage={currentPage}
        // onRowClick={navigateToEditPage}
        // onDeleteClick={deleteHandler}
        // disableFilters
        // onPaginationChange={setCurrentPage}
        // paginationExtraButton={id && <SecondaryButton onClick={navigateToTablePage} >Все</SecondaryButton>}
        // onFormSubmit={relation.is_editable && onFormSubmit}
        // createFormVisible={createFormVisible[relation.id]}
        // setCreateFormVisible={(val) => setCreateFormVisible(relation.id, val)}
//       />
//     </div>
//   )
// }

export default RelationTable
