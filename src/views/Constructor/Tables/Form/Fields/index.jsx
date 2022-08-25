// import { Delete, Edit } from "@mui/icons-material"
import { Add } from "@mui/icons-material"
import { useMemo, useState } from "react"
import { useFieldArray } from "react-hook-form"
import { useParams } from "react-router-dom"
import {
  CTableCell,
  CTableRow,
} from "../../../../../components/CTable"
import DataTable from "../../../../../components/DataTable"
import PermissionWrapperV2 from "../../../../../components/PermissionWrapper/PermissionWrapperV2"
import TableCard from "../../../../../components/TableCard"
import constructorFieldService from "../../../../../services/constructorFieldService"
import { generateGUID } from "../../../../../utils/generateID"
import FieldCreateForm from "./FieldCreateForm"
import styles from "./style.module.scss"

const Fields = ({ mainForm }) => {
  const { id, slug } = useParams()
  const [formLoader, setFormLoader] = useState(false)
  const [drawerState, setDrawerState] = useState(null)


  const { fields, prepend, update, remove } = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  })

  const createField = (field) => {

    const data = {
      ...field,
      id: generateGUID(),
    }

    if (!id) {
      prepend(data)
      setDrawerState(null)
    } else {
      setFormLoader(true)
      constructorFieldService.create(data).then((res) => {
        prepend(res)
        setDrawerState(null)
      }).finally(() =>  setFormLoader(false))
    }
  }

  const updateField = (field) => {

    const index = fields.findIndex(el => el.id === field.id)

    if (!id) {
      update(index, field)
      setDrawerState(null)
    } else {
      setFormLoader(true)
      constructorFieldService.update(field).then((res) => {
        update(index, field)
        setDrawerState(null)
      }).finally(() =>  setFormLoader(false))
    }
  }

  const openEditForm = (field) => {
    setDrawerState(field)
  }

  const deleteField = (field, index) => {
    if (!id) remove(index)
    else {
      constructorFieldService.delete(field.id).then((res) => remove(index))
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
        label: "Field Label",
        slug: "label",
      },
      {
        id: 2,
        label: "Field SLUG",
        slug: "slug",
      },
      {
        id: 3,
        label: "Field type",
        slug: "type",
      },
    ],
    []
  )

  return (
    <TableCard>
      <DataTable
        data={fields}
        removableHeight={false}
        columns={columns}
        disablePagination
        dataLength={1}
        tableSlug={'app'} // talk with Backend
        // loader={loader}
        onDeleteClick={deleteField}
        onEditClick={openEditForm}
        additionalRow={
          <PermissionWrapperV2 tabelSlug={slug} type="write">
            <CTableRow>
              <CTableCell colSpan={columns.length + 1}>
                <div
                  className={styles.createButton}
                  onClick={() => setDrawerState("CREATE")}
                >
                  <Add color="primary" />
                  <p>Добавить</p>
                </div>
              </CTableCell>
            </CTableRow>
          </PermissionWrapperV2>
        }
      />

      <FieldCreateForm
        open={drawerState}
        initialValues={drawerState}
        formIsVisible={drawerState}
        closeDrawer={() => setDrawerState(null)}
        onSubmit={onFormSubmit}
        isLoading={formLoader}
        mainForm={mainForm}
      />
    </TableCard>
  );

  // return (
  //   <TableCard>
  //     <CTable disablePagination removableHeight={false}>
  //       <CTableHead>
  //         <CTableRow>
  //           <CTableCell width="33%">Field Label</CTableCell>
  //           <CTableCell width="33%">Field SLUG</CTableCell>
  //           <CTableCell width="33%">Data type</CTableCell>
  //           <CTableCell width={10}></CTableCell>
  //         </CTableRow>
  //       </CTableHead>
  //       <CTableBody columnsCount={4} dataLength={1}>
  //         {fields?.map((element, index) => {
  //           return !element.editable ? (
  //             <CTableRow key={element.key}>
  //               <CTableCell>{element.label}</CTableCell>
  //               <CTableCell>{element.slug}</CTableCell>
  //               <CTableCell>{element.type}</CTableCell>
  //               <CTableCell>
  //                 <div className="flex">
  //                   <RectangleIconButton
  //                     color="success"
  //                     className="mr-1"
  //                     onClick={() => openEditForm(element, index)}
  //                   >
  //                     <Edit color="success" />
  //                   </RectangleIconButton>
  //                   <RectangleIconButton
  //                     color="error"
  //                     onClick={() => deleteField(element, index)}
  //                   >
  //                     <Delete color="error" />
  //                   </RectangleIconButton>
  //                 </div>
  //               </CTableCell>
  //             </CTableRow>
  //           ) : (
  //             <FieldCreateForm
  //               formIsVisible={true}
  //               onSubmit={(field) => updateField(field, index)}
  //               initialValues={element}
  //             />
  //           )
  //         })}
  //         <FieldCreateForm
  //           formIsVisible={createFormVisible}
  //           setFormIsVisible={setCreateFormVisible}
  //           onSubmit={createField}
  //         />
  //       </CTableBody>
  //     </CTable>
  //   </TableCard>
  // )
}

export default Fields
