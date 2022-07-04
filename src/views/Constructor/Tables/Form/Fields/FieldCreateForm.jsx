import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import { useSelector } from "react-redux"
import { relationTyes } from "../../../../../utils/constants/relationTypes"
import DrawerCard from "../../../../../components/DrawerCard"
import FRow from "../../../../../components/FormElements/FRow"
import constructorFieldService from "../../../../../services/constructorFieldService"
import listToOptions from "../../../../../utils/listToOptions"
import HFMultipleSelect from "../../../../../components/FormElements/HFMultipleSelect"
import { useParams } from "react-router-dom"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import { fieldTypes } from "../../../../../utils/constants/fieldTypes"
import { Divider } from "@mui/material"
import Attributes from "./Attributes"

const FieldCreateForm = ({
  onSubmit,
  closeDrawer,
  initialValues = {},
  open,
  isLoading = false,
}) => {
  const { id } = useParams()
  const { handleSubmit, control, reset, watch, getValues } = useForm()

  const submitHandler = (values) => {
    onSubmit(values)
  }

  const computedFieldTypes = useMemo(() => {
    return fieldTypes.map((type) => ({
      value: type,
      label: type,
    }))
  }, [])

  useEffect(() => {
    if (initialValues !== "CREATE")
      reset({
        attributes: {},
        default: "",
        index: "string",
        label: "",
        required: false,
        slug: "",
        table_id: id,
        type: "",
        ...initialValues,
      })
    else
      reset({
        attributes: {},
        default: "",
        index: "string",
        label: "",
        required: false,
        slug: "",
        table_id: id,
        type: "",
      })
    // reset({
    //   table_from: initialValues?.table_from?.slug ?? "",
    //   table_to: initialValues?.table_to?.slug ?? "",
    //   type: initialValues?.type ?? "",
    //   id: initialValues?.id ?? "",
    //   view_fields: initialValues?.view_fields?.map(field => field.id) ?? [],
    // })
  }, [open])

  return (
    <DrawerCard
      title={initialValues === "CREATE" ? "Create field" : "Edit field"}
      onClose={closeDrawer}
      open={open}
      onSaveButtonClick={handleSubmit(submitHandler)}
      loader={isLoading}
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <FRow label="Field Label" required>
          <HFTextField
            disabledHelperText
            fullWidth
            name="label"
            control={control}
            placeholder="Field Label"
            autoFocus
            required
          />
        </FRow>

        <FRow label="Field SLUG" required>
          <HFTextField
            disabledHelperText
            fullWidth
            name="slug"
            control={control}
            placeholder="Field SLUG"
            required
          />
        </FRow>

        <FRow label="Field type" required>
          <HFSelect
            disabledHelperText
            name="type"
            control={control}
            options={computedFieldTypes}
            placeholder="Type"
            required
          />
        </FRow>

        <Divider style={{ margin: "20px 0" }} />

        <Attributes control={control} watch={watch} />

        {/* <FRow label="Fields">
          <HFMultipleSelect
            name="view_fields"
            control={control}
            options={relatedTableFields}
            allowClear
          />
        </FRow> */}
      </form>
    </DrawerCard>
  )
}

export default FieldCreateForm
