import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator"
import styles from "./style.module.scss"

const DefaultValueBlock = ({ control, watch }) => {

  const relation = watch()

  console.log('RELATION ===>', relation)

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Default value</h2>
      </div>

      
      <FormElementGenerator
        control={control}
        field={relation}
        
      />



    </>
  )
}

export default DefaultValueBlock
