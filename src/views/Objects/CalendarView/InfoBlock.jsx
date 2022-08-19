import { format } from "date-fns"
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel"
import styles from "./style.module.scss"

const InfoBlock = ({ viewFields, data }) => {
  return (
    <div className={`${styles.infoBlock} ${styles.singleLine}`} >
      {data.calendar?.elementFromTime
        ? format(data.calendar?.elementFromTime, "HH:mm")
        : ""}
      -{" "}
      {viewFields?.map((field) => (
        <>
          {field.type === "LOOKUP"
            ? getRelationFieldTableCellLabel(field, data, field.table_slug)
            : data[field.slug]}
        </>
      ))}
    </div>
  )
}

export default InfoBlock
