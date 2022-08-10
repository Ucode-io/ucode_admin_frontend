import { format } from "date-fns"
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel"
import styles from "./style.module.scss"

const DataCard = ({ data, viewFields, navigateToEditPage }) => {
  return (
    <div
      key={data.guid}
      className={styles.infoBlockWrapper}
      style={{ top: data.startPosition }}
      onClick={() => navigateToEditPage(data)}
    >
      <div className={styles.infoBlock} style={{ height: data.height }}>
        {viewFields?.map((field) => (
          <div>
            {" "}
            <b>{field.label}: </b>{" "}
            {field.type === "LOOKUP"
              ? getRelationFieldTableCellLabel(field, data, field.table_slug)
              : data[field.slug]}
          </div>
        ))}

        <p className={styles.time}>
          {format(data.elementFromTime, "HH:mm")} -{" "}
          {format(data.elementToTime, "HH:mm")}
        </p>
      </div>
    </div>
  )
}

export default DataCard
