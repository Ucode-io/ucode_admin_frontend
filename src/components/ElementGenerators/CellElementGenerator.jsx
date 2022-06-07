import { get } from "@ngard/tiny-get"
import { format } from "date-fns"
import { memo, useMemo } from "react"
import LogoDisplay from "../LogoDisplay"

const CellElementGenerator = ({ field = {}, row }) => {
  console.log("FIELD ===>", field, row)


  const value = useMemo(() => {
    if (typeof(field.id) !== 'string' || !field.id?.includes("#")) return get(row, field.slug, "")

    const tableSlug = field.id.split("#")[0]

    const result =
      field.attributes
        ?.map((viewField) => get(row, `${tableSlug}.${viewField.slug}`, ""))
        .join(" ") ?? ""

    return result
  }, [row, field])

  switch (field.type) {
    case "DATE":
      return (
        <span className="text-nowrap">
          {value ? format(new Date(value), "dd.MM.yyyy") : "---"}
        </span>
      )

    case "DATE_TIME":
      return (
        <span className="text-nowrap">
          {value ? format(new Date(value), "dd.MM.yyyy HH:mm") : "---"}
        </span>
      )

    case "CHECKBOX":
    case "SWITCH":
      return value ? "Да" : "Нет"

    case "PHOTO":
      return <LogoDisplay url={value} />

    default:
      return value
  }
}

export default memo(CellElementGenerator)
