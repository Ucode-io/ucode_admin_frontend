import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel"
import DataColumn from "./DataColumn"
import MockColumn from "./MockColumn"
import styles from "./style.module.scss"

const RecursiveBlock = ({ date, computedData, groupColumns, level, view, workingDays }) => {


  if(level > groupColumns?.length) return null

  if(level === groupColumns?.length) return (
    <DataColumn computedData={computedData} date={date} view={view} workingDays={workingDays} />
  )
  
  

  return (
    <>
      <div className={styles.row}>
        {computedData?.map((el) => (
          <div className={styles.block}>
             <div className={styles.blockElement} >{getRelationFieldTabsLabel(groupColumns[level], el)}</div>
             {!el?.child?.length ? <MockColumn groupColumns={groupColumns} level={level} workingDays={workingDays} date={date} view={view} /> : <RecursiveBlock date={date} computedData={el?.child} groupColumns={groupColumns} level={level + 1} view={view} workingDays={workingDays} />}
          </div>
        ))}
      </div>
    </>
  )
}

export default RecursiveBlock
