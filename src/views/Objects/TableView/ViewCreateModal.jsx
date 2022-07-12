import { useMemo } from "react"
import { useForm } from "react-hook-form"
import FRow from "../../../components/FormElements/FRow"
import HFMultipleSelect from "../../../components/FormElements/HFMultipleSelect"
import HFSelect from "../../../components/FormElements/HFSelect"
import ModalCard from "../../../components/ModalCard"
import constructorViewService from "../../../services/constructorViewService"
import { arrayToOptions } from "../../../utils/arrayToOptions"
import { viewTypes } from "../../../utils/constants/viewTypes"
import listToOptions from "../../../utils/listToOptions"

const ViewCreateModal = ({
  tableSlug,
  fields = [],
  closeModal,
  initialValues = {},
  setViews,
}) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      group_fields: [
        {
          field_slug: "",
          field_type: "start_timestamp",
        },
        {
          field_slug: "",
          field_type: "end_timestamp",
        },
      ],
      main_field: "",
      table_slug: tableSlug,
      type: "",
      view_fields: [],
      // ...initialValues,
    },
  })
  
  const type = watch('type')

  const computedViewTypes = useMemo(() => {
    return arrayToOptions(viewTypes)
  }, [])

  const computedFields = useMemo(() => {

    const newFields = fields?.map(field => {

      // console.log("FIELD ===>", field)

      let slug = field.slug

      if(field.id.includes('#')) {
        
        const tableSlug = field.id.split('#')[0]
        const viewFields = field.attributes?.map(viewField => `${tableSlug}.${viewField.slug}`) ?? []

        slug = viewFields.join('#')
      }
      return {...field, slug}
    })

    

    return listToOptions(newFields, "label", "slug")
  }, [fields])



  console.log({fields})

  const submitHandler = async (values) => {
    try {
      let res

      if (initialValues.id) {
        res = await constructorViewService.update(values)
      } else {
        res = await constructorViewService.create(values)

        setViews((prev) => [...prev, res])
      }

      closeModal()
    } catch (error) {}
  }

  return (
    <ModalCard
      title="Create view"
      onClose={closeModal}
      onSaveButtonClick={handleSubmit(submitHandler)}
    >
      <form>
        <FRow label="View type">
          <HFSelect
            autoFocus
            fullWidth
            options={computedViewTypes}
            control={control}
            name="type"
          />
        </FRow>

        {type === "CALENDAR" && <FRow label="Start timestamp">
          <HFSelect
            fullWidth
            options={computedFields}
            control={control}
            name="group_fields[0].field_slug"
          />
        </FRow>}

        {type === "CALENDAR" && <FRow label="End timestamp">
          <HFSelect
            fullWidth
            options={computedFields}
            control={control}
            name="group_fields[1].field_slug"
          />
        </FRow>}

        <FRow label="Main field">
          <HFSelect
            fullWidth
            options={computedFields}
            control={control}
            name="main_field"
          />
        </FRow>

        {type === "CALENDAR" && <FRow label="View fields">
          <HFMultipleSelect
            fullWidth
            options={computedFields}
            control={control}
            name="view_fields"
          />
        </FRow>}
      </form>
    </ModalCard>
  )
}

export default ViewCreateModal
