import { Close } from "@mui/icons-material"
import { Divider, IconButton } from "@mui/material"
import { useState } from "react"
import { useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton"
import FRow from "../../../../../components/FormElements/FRow"
import HFCheckbox from "../../../../../components/FormElements/HFCheckbox"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import constructorFieldService from "../../../../../services/constructorFieldService"
import { fieldTypes, fieldTypesOptions } from "../../../../../utils/constants/fieldTypes"
import listToOptions from "../../../../../utils/listToOptions"
import Attributes from "../Fields/Attributes"
import styles from "./style.module.scss"

const FieldSettings = ({ closeSettingsBlock, mainForm, field, formType }) => {
  const { id } = useParams()
  const { handleSubmit, control, reset, watch } = useForm()
  const [formLoader, setFormLoader] = useState(false)

  const updateFieldInform = (field) => {
    const fields = mainForm.getValues("fields")
    const index = fields.findIndex((el) => el.id === field.id)

    mainForm.setValue(`fields[${index}]`, field)
  }

  const showTooltip = useWatch({
    control,
    name: "attributes.showTooltip",
  })

  const submitHandler = (values) => {
    if (!id) {
      updateFieldInform(values)
      closeSettingsBlock()
    } else {
      setFormLoader(true)
      constructorFieldService
        .update(values)
        .then((res) => {
          updateFieldInform(values)
          closeSettingsBlock()
        })
        .finally(() => setFormLoader(false))
    }
  }

  const selectedAutofillTableSlug = useWatch({
    control,
    name: "autofill_table",
  })

  const layoutRelations = useWatch({
    control: mainForm.control,
    name: "layoutRelations",
  })

  const computedRelationTables = useMemo(() => {
    return layoutRelations?.map((table) => ({
      value: table.id?.split("#")?.[0],
      label: table.label,
    }))
  }, [layoutRelations])

  const { data: computedRelationFields } = useQuery(
    ["GET_TABLE_FIELDS", selectedAutofillTableSlug],
    () => {
      if (!selectedAutofillTableSlug) return []
      return constructorFieldService.getList({
        table_slug: selectedAutofillTableSlug,
      })
    },
    {
      select: ({ fields }) =>
        listToOptions(
          fields?.filter((field) => field.type !== "LOOKUP"),
          "label",
          "slug"
        ),
    }
  )

  const computedFieldTypes = useMemo(() => {
    return fieldTypes.map((type) => ({
      value: type,
      label: type,
    }))
  }, [])

  useEffect(() => {
    if (formType !== "CREATE") {
      reset({
        attributes: {},
        default: "",
        index: "string",
        label: "",
        required: false,
        slug: "",
        table_id: id,
        type: "",
        ...field,
      })
    } else {
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
    }
  }, [field])

  return (
    <div className={styles.settingsBlock}>
      <div className={styles.settingsBlockHeader}>
        <h2>{formType === "CREATE" ? "Create field" : "Edit field"}</h2>

        <IconButton onClick={closeSettingsBlock}>
          <Close />
        </IconButton>
      </div>

      <div className={styles.settingsBlockBody}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className={styles.fieldSettingsForm}
        >
          <div className="p-2">
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
                withTrim
              />
            </FRow>

            <FRow label="Field type" required>
              <HFSelect
                disabledHelperText
                name="type"
                control={control}
                options={fieldTypesOptions}
                optionType="GROUP"
                placeholder="Type"
                required
                
              />
            </FRow>
          </div>

          <div className={styles.settingsBlockHeader}>
            <h2>Attributes</h2>

            {/* <IconButton onClick={closeSettingsBlock}>
              <Close />
            </IconButton> */}
          </div>

          {/* <div className="p-2"> */}
          <Attributes control={control} watch={watch} mainForm={mainForm} />
          {/* </div> */}

          <div className={styles.settingsBlockHeader}>
            <h2>Appearance</h2>
          </div>

          <div className="p-2">
            <FRow label="Placeholder">
              <HFTextField
                autoFocus
                fullWidth
                name="attributes.placeholder"
                control={control}
              />
            </FRow>

            {/* <FRow label="Allowed number of characters">
              <HFTextField
                fullWidth
                name="attributes.maxLength"
                control={control}
                type="number"
                min={0}
              />
            </FRow> */}

            <HFCheckbox
              control={control}
              name="attributes.showTooltip"
              label="Show tooltip"
              className="mb-1"
            />

            {showTooltip && (
              <FRow label="Tooltip text">
                <HFTextField
                  fullWidth
                  name="attributes.tooltipText"
                  control={control}
                />
              </FRow>
            )}
          </div>

          <div className={styles.settingsBlockHeader}>
            <h2>Validation</h2>
          </div>

          <div className="p-2">
            <HFCheckbox control={control} name="required" label="Required" />
            <HFCheckbox
              control={control}
              name="unique"
              label="Avoid duplicate values"
            />
          </div>

          <div className={styles.settingsBlockHeader}>
            <h2>Autofill settings</h2>
          </div>

          <div className="p-2">
            <FRow label="Autofill table">
              <HFSelect
                disabledHelperText
                name="autofill_table"
                control={control}
                options={computedRelationTables}
                placeholder="Type"
              />
            </FRow>

            <FRow label="Autofill field">
              <HFSelect
                disabledHelperText
                name="autofill_field"
                control={control}
                options={computedRelationFields}
                placeholder="Type"
              />
            </FRow>
          </div>
        </form>

        <div className={styles.settingsFooter}>
          <PrimaryButton
            size="large"
            className={styles.button}
            style={{ width: "100%" }}
            onClick={handleSubmit(submitHandler)}
            loader={formLoader}
          >
            Сохранить
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default FieldSettings
