import { format } from "date-fns"
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel"
import styles from "./style.module.scss"

const InfoBlock = ({ viewFields, data, isSingleLine }) => {
  if (isSingleLine)
    return (
      <div className={`${styles.infoBlock} ${styles.singleLine}`}>
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

  return (
    <div className={`${styles.infoBlock}`}>
      <div>
        {data.calendar?.elementFromTime
          ? format(data.calendar?.elementFromTime, "HH:mm")
          : ""}
        -{" "}
        {data.calendar?.elementToTime
          ? format(data.calendar?.elementToTime, " HH:mm")
          : ""}
      </div>

      {viewFields?.map((field) => (
        <p>
          {field.type === "LOOKUP"
            ? getRelationFieldTableCellLabel(field, data, field.table_slug)
            : data[field.slug]}
        </p>
      ))}
    </div>
  )
}

export default InfoBlock
