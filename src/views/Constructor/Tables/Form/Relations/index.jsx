import { Add, Delete, Edit } from "@mui/icons-material"
import { useMemo, useState } from "react"
import { useFieldArray } from "react-hook-form"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import {
  CTableCell,
  CTableRow,
} from "../../../../../components/CTable"
import DataTable from "../../../../../components/DataTable"
import TableCard from "../../../../../components/TableCard"
import constructorRelationService from "../../../../../services/constructorRelationService"
import { generateGUID } from "../../../../../utils/generateID"
import RelationCreateForm from "./RelationCreateForm"
import styles from "../Fields/style.module.scss"
import PermissionWrapperV2 from "../../../../../components/PermissionWrapper/PermissionWrapperV2"
import { Collapse, Drawer } from "@mui/material"
import RelationSettings from "../Layout/RelationSettings"

const Relations = ({ mainForm, getRelationFields }) => {
  const [formLoader, setFormLoader] = useState(false)
  const [drawerState, setDrawerState] = useState(null)
  const [loader, setLoader] = useState(false)

  const { fields: relations, update } = useFieldArray({
    control: mainForm.control,
    name: "relations",
    keyName: "key",
  })

  const { id, slug } = useParams()

  const updateRelations = async () => {
    setLoader(true)

    await getRelationFields()

    setDrawerState(null)
    setLoader(false)
  }

  const createField = (field) => {
    const data = {
      ...field,
      id: generateGUID(),
    }

    if (!id) {
      updateRelations()
      setDrawerState(null)
    } else {
      setFormLoader(true)
      constructorRelationService.create(data).then((res) => {
        updateRelations(res)
        setDrawerState(null)
      }).finally(() => setFormLoader(false))
    }
  }

  const updateField = (field, index) => {
    if (!id) {
      updateRelations()
    } else {
      setFormLoader(true)
      constructorRelationService.update(field).then((res) => {
        updateRelations()
      }).finally(() => setFormLoader(false))
    }
  }

  const openEditForm = (field, index) => {
    setDrawerState(field)
    // update(index, {
    //   ...field,
    //   editable: true,
    // })
  }

  const deleteField = (field, index) => {
    if (!id) updateRelations()
    else {
      constructorRelationService
        .delete(field.id)
        .then((res) => updateRelations())
    }
  }

  const onFormSubmit = (values) => {
    if (drawerState === "CREATE") {
      createField(values)
    } else {
      updateField(values)
    }
  }

  const columns = useMemo(
    () => [
      {
        id: 1,
        label: "Table from",
        slug: "table_from.label",
      },
      {
        id: 2,
        label: "Table to",
        slug: "table_to.label",
      },
      {
        id: 3,
        label: "Relation type",
        slug: "type",
      },
    ],
    []
  )

  return (
    <TableCard>
      <DataTable
        data={relations}
        removableHeight={false}
        tableSlug={'app'}
        columns={columns}
        disablePagination
        loader={loader}
        onDeleteClick={deleteField}
        onEditClick={openEditForm}
        dataLength={1}
        additionalRow={
          // <PermissionWrapperV2 tabelSlug={slug} type="write">
            <CTableRow>
              <CTableCell colSpan={columns.length + 2}>
                <div
                  className={styles.createButton}
                  onClick={() => setDrawerState("CREATE")}
                >
                  <Add color="primary" />
                  <p>Добавить</p>
                </div>
              </CTableCell>
            </CTableRow>
        }
      />

      <Drawer open={drawerState} anchor="right" onClose={() => setDrawerState(null)} orientation="horizontal" >
        <RelationSettings 
          relation={drawerState}
          closeSettingsBlock={() => setDrawerState(null)}
          getRelationFields={getRelationFields}
          formType={drawerState}
          height={`calc(100vh - 48px)`}
        />
      </Drawer>

    </TableCard>
  );
}

export default Relations
