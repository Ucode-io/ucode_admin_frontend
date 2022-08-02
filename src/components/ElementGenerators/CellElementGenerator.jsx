import { get } from "@ngard/tiny-get"
import { memo, useMemo } from "react"
import { formatDate } from "../../utils/dateFormatter"
import { numberWithSpaces } from "../../utils/formatNumbers"
import { getRelationFieldTableCellLabel } from "../../utils/getRelationFieldLabel"
import LogoDisplay from "../LogoDisplay"
import TableTag from "../TableTag"

const CellElementGenerator = ({ field = {}, row }) => {
  const value = useMemo(() => {
    if (typeof field.id !== "string" || !field.id?.includes("#"))
      return get(row, field.slug, "")

    const tableSlug = field.id.split("#")[0]

    const result = getRelationFieldTableCellLabel(field, row, tableSlug)

    // const result =
    //   field.attributes
    //     ?.map((viewField) => get(row, `${tableSlug}.${viewField?.slug}`, ""))
    //     .join(" ") ?? ""

    return result
  }, [row, field])

  switch (field.type) {
    case "DATE":
      return (
        <span className="text-nowrap">
          {formatDate(value)}
        </span>
      )

    case "NUMBER":
      return (
        <span>{ numberWithSpaces(value) }</span>
      )

    case "DATE_TIME":
      return (
        <span className="text-nowrap">
          {formatDate(value, "DATE_TIME")}
          {/* {value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "---"} */}
        </span>
      )

    case "MULTI_LINE":
      console.log("VALUE =====>", value)
      return (
        <span dangerouslySetInnerHTML={{ __html: value }} ></span>
      )

    case "CHECKBOX":
    case "SWITCH":
      return JSON.parse(value) ? (
        <TableTag color="success">
          {field.attributes?.text_true ?? 'Да'}
        </TableTag>
      ) : (
        <TableTag color="error">
          {field.attributes?.text_false ?? 'Нет'}
        </TableTag>
      )

    case "PHOTO":
      return <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} ><LogoDisplay url={value} /></span>

    default:
      return value
  }
}

export default memo(CellElementGenerator)
