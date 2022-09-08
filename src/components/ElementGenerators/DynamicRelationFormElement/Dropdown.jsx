import { ArrowBack, Close } from "@mui/icons-material"
import { CircularProgress, IconButton } from "@mui/material"
import { useMemo, useState } from "react"
import { useQuery } from "react-query"
import constructorObjectService from "../../../services/constructorObjectService"
import { getLabelWithViewFields } from "../../../utils/getRelationFieldLabel"
import IconGenerator from "../../IconPicker/IconGenerator"
import SearchInput from "../../SearchInput"
import styles from "./style.module.scss"

const Dropdown = ({ field, closeMenu }) => {
  const [selectedTable, setSelectedTable] = useState(null)

  const tablesList = useMemo(() => {
    return (
      field.attributes?.dynamic_tables?.map((el) => {
        return el.table ? { ...el.table, ...el } : el
      }) ?? []
    )
  }, [field.attributes?.dynamic_tables])

  const queryPayload = { limit: 10, offset: 0 }

  const { data: objectsList = [], isLoading: loader } = useQuery(
    ["GET_OBJECT_LIST_QUERY", selectedTable?.slug, queryPayload],
    () => {
      if (!selectedTable?.slug) return null
      return constructorObjectService.getList(selectedTable?.slug, {
        data: queryPayload,
      })
    },
    {
      select: (res) => {
        return (
          res?.data?.response?.map((el) => ({
            value: el.guid,
            label: getLabelWithViewFields(selectedTable.view_fields, el),
          })) ?? []
        )
      },
    }
  )

  return (
    <>
      <div className={styles.menuHeader}>
        {selectedTable ? (
          <IconButton color="primary" onClick={() => setSelectedTable(null)}>
            <ArrowBack />
          </IconButton>
        ) : (
          <div></div>
        )}

        {selectedTable?.label}

        <IconButton onClick={closeMenu}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.menuBody}>
        {selectedTable && (
          <div className={styles.menuRow}>
            <SearchInput size="small" fullWidth />
          </div>
        )}

        {!selectedTable ? (
          <>
            {tablesList.map((table) => (
              <div
                key={table.id}
                className={styles.menuRow}
                onClick={() => setSelectedTable(table)}
              >
                <IconGenerator icon={table.icon} />
                {table.label}
              </div>
            ))}
          </>
        ) : (
          <>
            {loader ? (
              <div className="flex align-center justify-center p-2">
                <CircularProgress />
              </div>
            ) : (
              objectsList?.map((object) => (
                <div
                  key={object.id}
                  className={styles.menuRow}
                  onClick={() => setSelectedTable(object)}
                >
                  {object.label}
                </div>
              ))
            )}
          </>
        )}

        {/* <div className={styles.menuRow}>
            <IconGenerator icon="user-doctor.svg" />
            Patients
          </div> */}
      </div>
    </>
  )
}

export default Dropdown
