import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"

import SecondaryButton from "../../../components/Buttons/SecondaryButton"
import FRow from "../../../components/FormElements/FRow"
import useTabRouter from "../../../hooks/useTabRouter"
import constructorObjectService from "../../../services/constructorObjectService"
import { listToMap } from "../../../utils/listToMap"
import { objectToArray } from "../../../utils/objectToArray"
import { pageToOffset } from "../../../utils/pageToOffset"
import { Filter } from "../components/FilterGenerator"
import styles from "./style.module.scss"
import ObjectDataTable from "../../../components/DataTable/ObjectDataTable"
import useCustomActionsQuery from "../../../queries/hooks/useCustomActionsQuery"

const RelationTable = ({
  setDataLength,
  relation,
  shouldGet,
  createFormVisible,
  remove,
  setCreateFormVisible,
  watch,
  selectedObjects,
  setSelectedObjects,
  tableSlug,
  id,
  reset,
  control,
  setFormValue,
  fields,
  setFormVisible,
  formVisible,
}) => {
  const { appId } = useParams()
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

  const onCheckboxChange = (val, row) => {
    if (val) setSelectedObjects((prev) => [...prev, row.guid])
    else setSelectedObjects((prev) => prev.filter((id) => id !== row.guid))
  }

  const computedFilters = useMemo(() => {
    const relationFilter = {}

    if (relation.type === "Many2Many") relationFilter[`${tableSlug}_ids`] = id
    else if (relation.type === "Many2Dynamic")
      relationFilter[`${relation.relatedTable}.${tableSlug}_id`] = id
    else relationFilter[`${tableSlug}_id`] = id

    return {
      ...filters,
      ...relationFilter,
    }
  }, [filters, tableSlug, id, relation.type, relation.relatedTable])

  const relatedTableSlug = relation?.relatedTable

  const {
    data: {
      tableData = [],
      pageCount = 1,
      columns = [],
      quickFilters = [],
    } = {},
    isLoading: dataFetchingLoading,
  } = useQuery(
    [
      "GET_OBJECT_LIST",
      relatedTableSlug,
      shouldGet,
      appId,
      {
        filters: computedFilters,
        offset: pageToOffset(currentPage, limit),
        limit,
      },
    ],
    () => {
      return constructorObjectService.getList(relatedTableSlug, {
        data: {
          offset: pageToOffset(currentPage, limit),
          limit: id ? limit : 0,
          ...computedFilters,
        },
      })
    },
    {
      enabled: !!appId,
      select: ({ data }) => {
        const tableData = id ? objectToArray(data.response ?? {}) : []
        const pageCount = isNaN(data.count) ? 1 : Math.ceil(data.count / limit)
        setDataLength(tableData.length)

        const fieldsMap = listToMap(data.fields)

        const columns = relation.columns
          ?.map((id, index) => fieldsMap[id])
          ?.filter((el) => el)
        const quickFilters = relation.quick_filters
          ?.map(({ field_id }) => fieldsMap[field_id])
          ?.filter((el) => el)
        return {
          tableData,
          pageCount,
          columns,
          quickFilters,
        }
      },
    }
  )

  useEffect(() => {
    if (tableData?.length) {
      console.log("tableData", tableData)
      reset({
        multi: tableData.map((i) => i),
      })
    }
  }, [tableData, reset])

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
        return constructorObjectService.delete(relatedTableSlug, row.guid)
      }
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["GET_OBJECT_LIST", relatedTableSlug])
      },
    }
  )

  const { data: { custom_events: customEvents = [] } = {} } =
    useCustomActionsQuery({
      tableSlug: relatedTableSlug,
    })

  const navigateToEditPage = (row) => {
    navigateToForm(relatedTableSlug, "EDIT", row)
  }

  const navigateToTablePage = () => {
    navigate(`/main/${appId}/object/${relatedTableSlug}`, {
      state: {
        [`${tableSlug}_${relation.type === "Many2Many" ? "ids" : "id"}`]: id,
      },
    })
  }

  // const { mutateAsync } = useMutation(
  //   (values) => {
  //     if (values.guid)
  //       return constructorObjectService.update(relatedTableSlug, {
  //         data: values,
  //       })
  //     else constructorObjectService.create(relatedTableSlug, { data: values })
  //   },
  //   {
  //     onSuccess: () => {
  //       setCreateFormVisible(false)
  //       queryClient.refetchQueries(["GET_OBJECT_LIST", relatedTableSlug])
  //     },
  //   }
  // )

  return (
    <div className={styles.relationTable}>
      {!!quickFilters?.length && (
        <div className={styles.filtersBlock}>
          {quickFilters.map((field) => (
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
      )}

      <div className={styles.tableBlock}>
        <ObjectDataTable
          remove={remove}
          watch={watch}
          isRelationTable={true}
          setFormVisible={setFormVisible}
          formVisible={formVisible}
          loader={dataFetchingLoading || deleteLoading}
          data={tableData}
          fields={fields}
          columns={columns}
          setFormValue={setFormValue}
          control={control}
          removableHeight={290}
          disableFilters
          pagesCount={pageCount}
          currentPage={currentPage}
          onRowClick={navigateToEditPage}
          onDeleteClick={deleteHandler}
          onPaginationChange={setCurrentPage}
          paginationExtraButton={
            id && (
              <SecondaryButton onClick={navigateToTablePage}>
                Все
              </SecondaryButton>
            )
          }
          createFormVisible={createFormVisible[relation.id]}
          setCreateFormVisible={(val) => setCreateFormVisible(relation.id, val)}
          limit={limit}
          setLimit={setLimit}
          summaries={relation.summaries}
          isChecked={(row) => selectedObjects?.includes(row.guid)}
          onCheckboxChange={!!customEvents?.length && onCheckboxChange}
        />
      </div>
    </div>
  )
}

export default RelationTable
