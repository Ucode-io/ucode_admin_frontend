import { useState, useEffect } from "react"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"

export default function Sorter({ value, onChange = () => {} }) {
  const [status, setStatus] = useState(value)

  useEffect(() => {
    onChange(status)
  }, [status])

  const handleClick = () => {
    if (status === "asc") setStatus("desc")
    else if (status === "desc") setStatus(undefined)
    else setStatus("asc")
  }

  return (
    <div
      style={{ width: 20, height: 20, color: "#6E8BB7BF" }}
      className="fill-current cursor-pointer flex flex-col items-center"
      onClick={handleClick}
    >
      <div
        className={`fill-current ${status === "asc" ? "text-blue-600" : ""}`}
        style={{ marginTop: "-10px" }}
      >
        <ArrowDropUpIcon fontSize="medium" />
      </div>
      <div
        className={`fill-current ${status === "desc" ? "text-blue-600" : ""}`}
        style={{ marginTop: "-9px" }}
      >
        <ArrowDropDownIcon fontSize="medium" />
      </div>
    </div>
  )
}
