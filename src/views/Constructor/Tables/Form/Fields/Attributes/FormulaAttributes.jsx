import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import FRow from "../../../../../../components/FormElements/FRow"
import HFSelect from "../../../../../../components/FormElements/HFSelect"
import constructorFieldService from "../../../../../../services/constructorFieldService"
import listToOptions from "../../../../../../utils/listToOptions"
import styles from "./style.module.scss"

const FormulaAttributes = ({ control, mainForm }) => {
  const { t } = useTranslation()
  const tableRelations = useWatch({
    control: mainForm.control,
    name: "tableRelations",
  })

  const formulaTypes = useMemo(
    () => [
      { label: t("sum"), value: "SUMM" },
      { label: t("max"), value: "MAX" },
      { label: t("average"), value: "AVG" },
    ],
    []
  )

  const selectedTableSlug = useWatch({
    control,
    name: "attributes.table_from",
  })

  const type = useWatch({
    control,
    name: "attributes.type",
  })

  const computedTables = useMemo(() => {
    return tableRelations?.map((relation) => {
      const relatedTable = relation[relation.relatedTableSlug]

      return {
        label: relatedTable?.label,
        value: relatedTable?.slug,
      }
    })
  }, [tableRelations])

  const { data: fields } = useQuery(
    ["GET_TABLE_FIELDS", selectedTableSlug],
    () => {
      if (!selectedTableSlug) return []
      return constructorFieldService.getList({ table_slug: selectedTableSlug })
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

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>{t("settings")}</h2>
      </div>
      <div className="p-2">
        <FRow label={t("formula.type")}>
          <HFSelect
            name="attributes.type"
            control={control}
            options={formulaTypes}
          />
        </FRow>

        {(type === "SUMM" || type === "MAX") && (
          <>
            <FRow label={t("table.from")}>
              <HFSelect
                name="attributes.table_from"
                control={control}
                options={computedTables}
              />
            </FRow>

            <FRow label={t("field.from")}>
              <HFSelect
                name="attributes.sum_field"
                control={control}
                options={fields}
              />
            </FRow>
          </>
        )}

        {/* <FRow label="Table to"  >
        <HFSelect
          name="attributes.table_to"
          control={control}
          options={formulaTypes}
        />
      </FRow> */}
      </div>
    </>
  )
}

export default FormulaAttributes
