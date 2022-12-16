import { useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"
import FRow from "../../../../../components/FormElements/FRow"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import DynamicRelationRow from "./DynamicRelationRow"
import styles from "./style.module.scss"

const DynamicRelationsBlock = ({ control, computedTablesList }) => {
  const { t } = useTranslation()
  const {
    fields: dynamicTables,
    insert,
    remove,
  } = useFieldArray({
    control,
    name: "dynamic_tables",
    keyName: "key",
  })

  const addNewTable = () => {
    insert({
      table_slug: "",
      view_fields: "",
    })
  }

  const deleteTable = (index) => {
    remove(index)
  }

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>{t("dynamic.tables")}</h2>
      </div>

      <div className="p-2">
        <FRow label="Field slug">
          <HFTextField fullWidth name="relation_field_slug" control={control} />
        </FRow>

        {dynamicTables?.map((table, index) => (
          <DynamicRelationRow
            key={table.key}
            control={control}
            index={index}
            deleteTable={deleteTable}
            computedTablesList={computedTablesList}
          />
        ))}

        <div className={styles.summaryButton} onClick={addNewTable}>
          <button type="button">+ {t("create.new")}</button>
        </div>
      </div>
    </>
  )
}

export default DynamicRelationsBlock
