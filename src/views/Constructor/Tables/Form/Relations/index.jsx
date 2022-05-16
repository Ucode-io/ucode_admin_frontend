import { Delete, Edit } from "@mui/icons-material"
import { useState } from "react"
import { useFieldArray } from "react-hook-form"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableRow,
} from "../../../../../components/CTable"
import TableCard from "../../../../../components/TableCard"
import constructorRelationService from "../../../../../services/constructorRelationService"
import { generateGUID } from "../../../../../utils/generateID"
import RelationCreateForm from "./RelationCreateForm"

const Relations = ({ mainForm, getRelationFields }) => {
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [loader, setLoader] = useState(false)

  const {
    fields: relations,
    update,
  } = useFieldArray({
    control: mainForm.control,
    name: "relations",
    keyName: "key",
  })

  const { id } = useParams()

  const updateRelations = async () => {
    setLoader(true)

    await getRelationFields()

    setCreateFormVisible(false)
    setLoader(false)
  }

  const createField = (field) => {
    const data = {
      ...field,
      id: generateGUID(),
    }
    
    if (!id) {
      updateRelations()
      setCreateFormVisible(false)
    } else {
      constructorRelationService.create(data).then((res) => {
        updateRelations(res)
        setCreateFormVisible(false)
      })
    }
  }

  const updateField = (field, index) => {
    if (!id) {
      updateRelations()
    } else {
      constructorRelationService.update(field).then((res) => {
        updateRelations()
      })
    }
  }

  const openEditForm = (field, index) => {
    update(index, {
      ...field,
      editable: true,
    })
  }

  const deleteField = (field, index) => {
    if (!id) updateRelations()
    else {
      constructorRelationService.delete(field.id).then((res) => updateRelations())
    }
  }

  return (
    <TableCard>
      <CTable disablePagination removableHeight={false}>
        <CTableRow>
          <CTableCell width="33%">Table from</CTableCell>
          <CTableCell width="33%">Table to</CTableCell>
          <CTableCell width="33%">Relation type</CTableCell>
          <CTableCell width={10}></CTableCell>
        </CTableRow>

        <CTableBody loader={loader} columnsCount={4} dataLength={1}>
          {relations?.map((relation, index) =>
            !relation.editable ? (
              <CTableRow key={relation.id}>
                <CTableCell>{relation.table_from.slug}</CTableCell>
                <CTableCell>{relation.table_to.slug}</CTableCell>
                <CTableCell>{relation.type}</CTableCell>
                <CTableCell>
                  <div className="flex">
                    <RectangleIconButton
                      color="success"
                      className="mr-1"
                      onClick={() => openEditForm(relation, index)}
                    >
                      <Edit color="success" />
                    </RectangleIconButton>
                    <RectangleIconButton
                      color="error"
                      onClick={() => deleteField(relation, index)}
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </div>
                </CTableCell>
              </CTableRow>
            ) : (
              <RelationCreateForm
                formIsVisible={true}
                onSubmit={(relation) => updateField(relation, index)}
                initialValues={relation}
              />
            )
          )}

          <RelationCreateForm
            formIsVisible={createFormVisible}
            setFormIsVisible={setCreateFormVisible}
            onSubmit={createField}
          />
        </CTableBody>
      </CTable>
    </TableCard>
  )
}

export default Relations
