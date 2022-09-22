import { format } from "date-fns"
import { dateValidFormat } from "../../../utils/dateValidFormat"
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel"
import styles from "./style.module.scss"

const InfoBlock = ({ viewFields, data, isSingleLine }) => {
  console.log("DATA ===>", data)


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
              : field.type === "DATE_TIME"
              ? dateValidFormat(data[field.slug], "dd.MM.yyyy HH:mm")
              : data[field.slug]}
          </>
        ))}
      </div>
    )

  return (
    <div className={`${styles.infoBlock}`}>
      <div>
        {dateValidFormat(data.calendar?.elementFromTime, "HH:mm")}-{" "}
        {dateValidFormat(data.calendar?.elementToTime, " HH:mm")}
      </div>

      {viewFields?.map((field) => (
        <p>
       {field.type === "LOOKUP"
              ? getRelationFieldTableCellLabel(field, data, field.table_slug)
              : field.type === "DATE_TIME"
              ? dateValidFormat(data[field.slug], "dd.MM.yyyy HH:mm")
              : data[field.slug]}
        </p>
      ))}
    </div>
  )
}

export default InfoBlock
