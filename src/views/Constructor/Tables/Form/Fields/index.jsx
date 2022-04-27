import { Delete, Edit } from "@mui/icons-material"
import { useState } from "react"
import { useFieldArray } from "react-hook-form"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../../components/CTable"
import TableCard from "../../../../../components/TableCard"
import contructorFieldService from "../../../../../services/contructorFieldService"
import FieldCreateForm from "./FieldCreateForm"

const Fields = ({ control }) => {
  const { id } = useParams()
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [selectedField, setSelectedField] = useState(null)

  const { fields, prepend, update, remove } = useFieldArray({
    control,
    name: "fields",
    keyName: "key",
  })

  const createField = (field) => {
    if (!id) {
      prepend(field)
      setCreateFormVisible(false)
    } else {
      contructorFieldService.create(field).then((res) => {
        prepend(res)
        setCreateFormVisible(false)
      })
    }
  }

  const updateField = (field, index) => {
    if (!id) {
      update(index, field)
      setSelectedField(null)
    } else {
      contructorFieldService.update(field).then((res) => {
        update(index, field)
        setSelectedField(false)
      })
    }
  }

  const deleteField = (field, index) => {
    if (!id) remove(index)
    else {
      contructorFieldService.delete(field.id).then((res) => remove(index))
    }
  }

  return (
    <TableCard>
      <CTable disablePagination removableHeight={false}>
        <CTableHead>
          <CTableRow>
            <CTableCell width="33%">Field Label</CTableCell>
            <CTableCell width="33%">Field SLUG</CTableCell>
            <CTableCell width="33%">Data type</CTableCell>
            <CTableCell width={10}></CTableCell>
          </CTableRow>
        </CTableHead>
        <CTableBody columnsCount={4} dataLength={1}>
          {fields?.map((element, index) => {
            return selectedField?.id !== element.id ? (
              <CTableRow key={element.key}>
                <CTableCell>{element.label}</CTableCell>
                <CTableCell>{element.slug}</CTableCell>
                <CTableCell>{element.type}</CTableCell>
                <CTableCell>
                  <div className="flex">
                    <RectangleIconButton
                      color="success"
                      className="mr-1"
                      onClick={() => setSelectedField(element)}
                    >
                      <Edit color="success" />
                    </RectangleIconButton>
                    <RectangleIconButton
                      color="error"
                      onClick={() => deleteField(element, index)}
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </div>
                </CTableCell>
              </CTableRow>
            ) : (
              <FieldCreateForm
                formIsVisible={true}
                onSubmit={(field) => updateField(field, index)}
                initialValues={selectedField}
              />
            )
          })}
          <FieldCreateForm
            formIsVisible={createFormVisible}
            setFormIsVisible={setCreateFormVisible}
            onSubmit={createField}
          />
        </CTableBody>
      </CTable>
    </TableCard>
  )
}

export default Fields
