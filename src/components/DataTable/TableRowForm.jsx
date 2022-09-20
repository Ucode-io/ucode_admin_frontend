import { Close, Save } from "@mui/icons-material"
import { Checkbox } from "@mui/material"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import constructorObjectService from "../../services/constructorObjectService"
import RectangleIconButton from "../Buttons/RectangleIconButton"
import { CTableCell, CTableRow } from "../CTable"
import CellFormElementGenerator from "../ElementGenerators/CellFormElementGenerator"

const TableRowForm = ({
  onCheckboxChange,
  checkboxValue,
  row,
  currentPage,
  rowIndex,
  columns,
  tableHeight,
  tableSettings,
  pageName,
  calculateWidth,
  setFormVisible,
  limit = 10,
  onFormSubmit = () => {},
}) => {
  const {tableSlug, id} = useParams()

  const [loader, setLoader] = useState()
  const { control, handleSubmit, setValue: setFormValue } = useForm({
    defaultValues: row ?? {
      [`${tableSlug}_id`]: id
    }
  })

  const onSubmit = (values) => {
    setLoader(true)
    onFormSubmit(values).then(() => {
      setFormVisible(false)
    }).catch(() => setLoader(false))
  }

  return (
    <CTableRow>
      {onCheckboxChange && (
        <CTableCell>
          <Checkbox
            checked={checkboxValue === row.guid}
            onChange={(_, val) => onCheckboxChange(val, row)}
            onClick={(e) => e.stopPropagation()}
          />
        </CTableCell>
      )}
      <CTableCell align="center">
        {(currentPage - 1) * limit + rowIndex + 1}
      </CTableCell>
      {columns.map((column, index) => (
        <CTableCell
          key={column.id}
          className={`overflow-ellipsis ${tableHeight}`}
          style={{
            padding: "8px 12px 4px",
            position: tableSettings?.[pageName]?.find(
              (item) => item?.id === column?.id
            )?.isStiky
              ? "sticky"
              : "relative",
            left: tableSettings?.[pageName]?.find(
              (item) => item?.id === column?.id
            )?.isStiky
              ? calculateWidth(column?.id, index)
              : "0",
            backgroundColor: "#fff",
            zIndex: tableSettings?.[pageName]?.find(
              (item) => item?.id === column?.id
            )?.isStiky
              ? "1"
              : "",
              minWidth: 270,
          }}
          
        >
          <CellFormElementGenerator fields={columns} field={column} row={row} control={control} setFormValue={setFormValue} />
        </CTableCell>
      ))}
      <CTableCell style={{ padding: "8px 12px 4px", verticalAlign: "middle" }}>
        <div className="flex">
          <RectangleIconButton
            color="success"
            className="mr-1"
            size="small"
            onClick={handleSubmit(onSubmit)}
            loader={loader}
          >
            <Save color="success" />
          </RectangleIconButton>
          <RectangleIconButton
            color="error"
            onClick={() => setFormVisible(false)}
          >
            <Close color="error" />
          </RectangleIconButton>
        </div>
      </CTableCell>
    </CTableRow>
  )
}

export default TableRowForm
