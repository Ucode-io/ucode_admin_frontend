import { useMemo } from "react"
import CSelect from "../../../../components/CSelect"
import styles from "./style.module.scss"

const Variable = ({ variable = {}, value, onChange }) => {

  const options = useMemo(() => {
    return variable.options?.map(option => ({
      value: option,
      label: option,
    }))
  }, [variable])

  return (
    <div className={styles.variable}>
      <div className={styles.label}>{ variable.label }</div>

      <div className={styles.value}>
        <CSelect disabledHelperText options={options} onChange={onChange} value={value} />
      </div>
    </div>
  )
}

export default Variable
