import { Radio as ReactRadio } from "react-radio-group"

export default function Radio({
  children,
  value,
  hide = true,
  className = "",
  ...props
}) {
  return (
    <label className={`flex items-center gap-2 ${className}`}>
      {hide && (
        <ReactRadio
          className="cursor-pointer"
          style={{ width: 16 }}
          value={value}
          {...props}
        />
      )}
      {children}
    </label>
  )
}
