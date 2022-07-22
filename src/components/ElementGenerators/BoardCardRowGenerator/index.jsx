import { get } from "@ngard/tiny-get"
import { format } from "date-fns"
import { useMemo } from "react"
import styles from "./style.module.scss"

const BoardCardRowGenerator = ({ tableColumn, el }) => {

  const value = useMemo(() => {
    if (typeof tableColumn.id !== "string" || !tableColumn.id?.includes("#"))
      return get(el, tableColumn.slug, "")

    const tableSlug = tableColumn.id.split("#")[0]

    const result =
    tableColumn.attributes
        ?.map((viewField) => get(el, `${tableSlug}.${viewField?.slug}`, ""))
        .join(" ") ?? ""

    return result
  }, [tableColumn, el])

  switch (tableColumn?.type) {
    case "PHOTO":
      return (
        <div key={tableColumn.id} className={styles.row}>
          <div className={styles.label}>{tableColumn.label}:</div>
          <img src={value} alt="board_image" className={styles.image} />
        </div>
      )

    case "DATE":
      return (
        <div key={tableColumn.id} className={styles.row}>
          <div className={styles.label}>{tableColumn.label}:</div>
          <div className={styles.value}>{value ? format(new Date(value), 'dd.MM.yyyy') : '---'}</div>
        </div>
      )

      case "DATE_TIME":
        return (
          <div key={tableColumn.id} className={styles.row}>
            <div className={styles.label}>{tableColumn.label}:</div>
            <div className={styles.value}>{value ? format(new Date(value), 'dd.MM.yyyy HH:mm') : '---'}</div>
          </div>
        )

    default:
      return (
        <div key={tableColumn.id} className={styles.row}>
          <div className={styles.label}>{tableColumn.label}:</div>
          <div className={styles.value}>{value}</div>
        </div>
      )
  }
}

export default BoardCardRowGenerator
