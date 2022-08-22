import styles from "./style.module.scss"

const PageSizeBlock = () => {
  return (
    <div className={styles.docListBlock}>
      <div className={styles.doclistHeader}>
        <div className={styles.doclistHeaderTitle}>Формат документа</div>
      </div>

      <div className={styles.docList}>

      <div className={styles.pageSizeRow}>
        <h3>Paper</h3>
      </div>

        <div className={styles.pageSizeRow}>
          A4 <span className={styles.pageSizeValue}>595 x 842</span>
        </div>

        <div className={styles.pageSizeRow}>
          A5 <span className={styles.pageSizeValue}>420 x 595</span>
        </div>

        <div className={styles.pageSizeRow}>
          A6 <span className={styles.pageSizeValue}>297 x 792</span>
        </div>

        <div className={styles.pageSizeRow}>
          Letter <span className={styles.pageSizeValue}>612 x 792</span>
        </div>

        {/* {templates?.map((template) => (
          <div
            key={template.id}
            className={`${styles.row} ${
              selectedTemplate?.id === template.id ? styles.active : ""
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            {template.title}
          </div>
        ))} */}
      </div>
    </div>
  )
}

export default PageSizeBlock
