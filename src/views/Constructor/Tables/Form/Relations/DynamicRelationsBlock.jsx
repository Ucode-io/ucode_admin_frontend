
import DynamicRelationRow from "./DynamicRelationRow"
import styles from "./style.module.scss"

const DynamicRelationsBlock = () => {
  // const { fields: dynamicTypes, insert, remove } = useFieldArray({
  //   control,
  //   name: "summaries",
  //   keyName: "key",
  // })


  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Summary</h2>
      </div>

      <div className="p-2">
        {/* <DynamicRelationRow  /> */}
      </div>

    </>
  )
}

export default DynamicRelationsBlock
