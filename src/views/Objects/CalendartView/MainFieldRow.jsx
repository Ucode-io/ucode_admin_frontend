import { ArrowDropDown, ArrowRight } from "@mui/icons-material"
import styles from "./style.module.scss"

const MainFieldRow = ({ data }) => {

  return (
    <div className={styles.mainFieldRow}>
      <div className={styles.mainFieldNamesBlock}>
        <div>
          Доктор <ArrowRight />{" "}
        </div>

        <div>
          Время <ArrowDropDown />{" "}
        </div>
      </div>

      {data?.map((el) => {
        if (!el.mainFields?.length)
          return <div key={el.date} className={styles.mainFieldBlock} />
        return el.mainFields.map((mainField) => (
          <div key={mainField.title} className={styles.mainFieldBlock}>
            <p className={styles.mainFieldTitle}>{mainField.title}</p>
            <p className={styles.mainFieldSubtitle}></p>
          </div>
        ))
      })}
    </div>
  )
}

export default MainFieldRow
