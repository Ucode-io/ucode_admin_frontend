import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import { useSelector } from "react-redux"
import { relationTyes } from "../../../../../utils/constants/relationTypes"
import DrawerCard from "../../../../../components/DrawerCard"
import FRow from "../../../../../components/FormElements/FRow"
import { useQuery } from "react-query"
import constructorFieldService from "../../../../../services/constructorFieldService"
import listToOptions from "../../../../../utils/listToOptions"
import HFMultipleSelect from "../../../../../components/FormElements/HFMultipleSelect"
import { useParams } from "react-router-dom"

const RelationCreateForm = ({
  onSubmit,
  closeDrawer,
  initialValues = {},
  open,
  isLoading=false
}) => {
  const tablesList = useSelector((state) => state.constructorTable.list)


  const { handleSubmit, control, reset, watch } = useForm()


  const values = watch()

  const relatedTableSlug = useMemo(() => {
    if(values.type === 'Many2One') return values.table_to
    if(values.type === 'One2Many' || values.type === 'Recursive') return values.table_from
    return null
  }, [values])
  

  const { data: relatedTableFields } = useQuery(
    ["GET_TABLE_FIELDS", relatedTableSlug],
    () => {
      if(!relatedTableSlug) return []
      return constructorFieldService.getList({ table_slug: relatedTableSlug })
    },
    {
      select: ({ fields }) => {
        return listToOptions(fields?.filter(field => field.type !== 'LOOKUP'), "label", "id")
      },
    }
  )

  const computedTablesList = useMemo(() => {
    return tablesList.map((table) => ({
      value: table.slug,
      label: table.label,
    }))
  }, [tablesList])

  const isRecursiveRelation = useMemo(() => {
    return values.type === "Recursive"
  }, [values.type])

  const computedRelationsTypesList = useMemo(() => {
    return relationTyes.map((type) => ({
      value: type,
      label: type,
    }))
  }, [])

  const submitHandler = (values) => {
    onSubmit({
      ...values,
      table_to: isRecursiveRelation ? values.table_from : values.table_to
    })
  }

  useEffect(() => {
    reset({
      table_from: initialValues?.table_from?.slug ?? "",
      table_to: initialValues?.table_to?.slug ?? "",
      type: initialValues?.type ?? "",
      id: initialValues?.id ?? "",
      view_fields: initialValues?.view_fields?.map(field => field.id) ?? [],
    })
  }, [open])

  return (
    <DrawerCard
      title={initialValues === "CREATE" ? "Create relation" : "Edit relation"}
      onClose={closeDrawer}
      open={open}
      onSaveButtonClick={handleSubmit(submitHandler)}
      loader={isLoading}
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <FRow label="Table from">
          <HFSelect
            name="table_from"
            control={control}
            placeholder="Field Label"
            options={computedTablesList}
            autoFocus
            required
          />
        </FRow>
        
        {!isRecursiveRelation && <FRow label="Table to">
          <HFSelect
            name="table_to"
            control={control}
            placeholder="Field Label"
            options={computedTablesList}
            required
          />
        </FRow>}

        <FRow label="Relation type">
          <HFSelect
            name="type"
            control={control}
            placeholder="Field Label"
            options={computedRelationsTypesList}
            required
          />
        </FRow>

        <FRow label="Fields">
          <HFMultipleSelect
            name="view_fields"
            control={control}
            options={relatedTableFields}
            allowClear
          />
        </FRow>
      </form>
    </DrawerCard>
  )
}

export default RelationCreateForm
