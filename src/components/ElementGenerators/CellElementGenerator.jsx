import { format } from "date-fns"
import { memo } from "react"
import LogoDisplay from "../LogoDisplay"

const CellElementGenerator = ({ type, value }) => {

  switch (type) {
    case "DATE":
      return (
        <span className="text-nowrap">
          {value ? format(new Date(value), 'dd.MM.yyyy') : '---'}
        </span>
      )
    
    case "CHECKBOX":
      case "SWITCH":
        return value ? 'Да' : 'Нет'

    case "PHOTO":
      return <LogoDisplay url={value} />

    default:
      return value
  }
}

export default memo(CellElementGenerator)
