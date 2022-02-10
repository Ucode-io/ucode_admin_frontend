import { useTranslation } from "react-i18next"

export default function StatusTag({ status, innerText, color, className, style, disableBorderRadius }) {
  const { t } = useTranslation()

  return (
    <div
      style={{  color: color ?? "#fff", whiteSpace: "nowrap", ...style }}
      className={`
        bg-${status ? "info" : "danger"}
        py-1 px-2.5 
        text-sm w-1/2
        ${disableBorderRadius ? "" : "rounded-md"} text-center 
        ${className}`}
    >
      {innerText ? innerText : t(status ? "active" : "inactive")}
    </div>
  )
}
