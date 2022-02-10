import { useTranslation } from "react-i18next"

export default function StatusTag({
  status,
  innerText,
  color,
  className,
  style,
  disableBorderRadius,
}) {
  const { t } = useTranslation()

  const bgColor = {
    true: "bg-blue-100",
    false: "bg-red-100",
  }

  return (
    <div
      style={{
        backgroundColor: color + "30",
        color: color ?? "#fff",
        whiteSpace: "nowrap",
        ...style,
      }}
      className={`
        ${bgColor[status]} 
        py-1 px-2.5 
        text-sm w-full 
        ${disableBorderRadius ? "" : "rounded-md"} text-center 
        ${className}`}
    >
      {innerText ? innerText : t(status ? "active" : "inactive")}
    </div>
  )
}
