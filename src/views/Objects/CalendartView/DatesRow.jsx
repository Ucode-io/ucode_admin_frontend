import styles from "./style.module.scss"

const DatesRow = ({ data }) => {
  console.log("DATA ==>", data)


  return (
    <div className={styles.datesRow}>
      <div className={styles.sss} />

      {data?.map((el) => (
        <div key={el.date} className={styles.dateBlock} style={{ minWidth: 200 * el.mainFields.length || 200 }} >{el.date}</div>
      ))}

      {/* <div className={styles.dateBlock}>Пн, 20 июля</div>

      <div className={styles.dateBlock}>Пн, 20 июля</div>

      <div className={styles.dateBlock}>Пн, 20 июля</div>

      <div className={styles.dateBlock}>Пн, 20 июля</div>
      <div className={styles.dateBlock}>Пн, 20 июля</div>
      <div className={styles.dateBlock}>Пн, 20 июля</div>
      <div className={styles.dateBlock}>Пн, 20 июля</div>
      <div className={styles.dateBlock}>Пн, 20 июля</div> */}
    </div>
  )
}

export default DatesRow
