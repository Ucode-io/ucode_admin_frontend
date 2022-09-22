import { Delete } from "@mui/icons-material"
import { useFieldArray } from "react-hook-form"
import { useQuery } from "react-query"

import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import constructorFieldService from "../../../../../services/constructorFieldService"
import styles from "./style.module.scss"

const AutoFiltersBlock = ({ control, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "auto_filters",
  })

  const addNewSummary = () => append({})
  const deleteSummary = (index) => remove(index)

  const { data: fieldFromList, isLoading: fieldFromListLoading } = useQuery(
    ["GET_FIELDS_LIST", watch("table_from")],
    () =>
      constructorFieldService.getList({
        table_slug: watch("table_from"),
      }),
    {
      enabled: !!watch("table_from"),
    }
  )

  const { data: fieldsToList, isLoading: fieldToListLoading } = useQuery(
    ["GET_FIELDS_LIST", watch("table_to")],
    () =>
      constructorFieldService.getList({
        table_slug: watch("table_to"),
      }),
    {
      enabled: !!watch("table_to"),
    }
  )

  const attributeFields = [
    {
      slug: "field_from",
      isLoading: fieldFromListLoading,
      placeholder: "Field From",
      options: fieldFromList?.fields?.map((i) => ({
        label: i.slug,
        value: i.slug,
      })),
    },
    {
      slug: "field_to",
      isLoading: fieldToListLoading,
      placeholder: "Field to",
      options: fieldsToList?.fields?.map((i) => ({
        label: i.slug,
        value: i.slug,
      })),
    },
  ]

  return (
    <div className={styles.autofiltersBlock}>
      <div className={styles.title}>Autofilters</div>
      <div className={styles.body}>
        {fields.map((field, index) => (
          <div className={styles.inputsWrapper} key={field.id}>
            {attributeFields.map((item) => (
              <HFSelect
                key={field.id}
                control={control}
                options={item.options}
                loading={item.isLoading}
                placeholder={item.placeholder}
                name={`auto_filters.${index}.${item.slug}`}
              />
            ))}
            <RectangleIconButton
              color="error"
              onClick={() => deleteSummary(index)}
            >
              <Delete color="error" />
            </RectangleIconButton>
          </div>
        ))}
        <div className={styles.summaryButton} onClick={addNewSummary}>
          <button type="button">+ Создать новый</button>
        </div>
      </div>
    </div>
  )
}

export default AutoFiltersBlock
