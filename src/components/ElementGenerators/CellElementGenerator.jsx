import { get } from "@ngard/tiny-get"
import { memo, useMemo } from "react"
import { formatDate } from "../../utils/dateFormatter"
import { numberWithSpaces } from "../../utils/formatNumbers"
import { getRelationFieldTableCellLabel } from "../../utils/getRelationFieldLabel"
import { parseBoolean } from "../../utils/parseBoolean"
import IconGenerator from "../IconPicker/IconGenerator"
import LogoDisplay from "../LogoDisplay"
import TableTag from "../TableTag"

const CellElementGenerator = ({ field = {}, row }) => {
  const value = useMemo(() => {
    if (field.type !== "LOOKUP") return get(row, field.slug, "")

    const result = getRelationFieldTableCellLabel(field, row, field.table_slug)

    return result
  }, [row, field])

  if (field.render) {
    return field.render(row)
  }

  switch (field.type) {
    case "DATE":
      return (
        <span className="text-nowrap">
          {formatDate(value)}
        </span>
      )

    case "NUMBER":
      return (
        <span className="text-nowrap" >{ numberWithSpaces(value) }</span>
      )

    case "DATE_TIME":
      return (
        <span className="text-nowrap">
          {formatDate(value, "DATE_TIME")}
          {/* {value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "---"} */}
        </span>
      )

    case "MULTI_LINE":
      return (
        <span dangerouslySetInnerHTML={{ __html: value }} ></span>
      )

    case "CHECKBOX":
    case "SWITCH":
      return parseBoolean(value) ? (
        <TableTag color="success">
          {field.attributes?.text_true ?? 'Да'}
        </TableTag>
      ) : (
        <TableTag color="error">
          {field.attributes?.text_false ?? 'Нет'}
        </TableTag>
      )

    case "ICO": 
      return <IconGenerator icon={value} />

    case "PHOTO":
      return <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} ><LogoDisplay url={value} /></span>

    default:
      return value
  }
}

export default memo(CellElementGenerator)
