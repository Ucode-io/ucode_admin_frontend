import { useState } from "react"
import VisibilityIcon from "@material-ui/icons/Visibility"
import InputMask from "react-input-mask"

export default function CustomInputMask({
  mask,
  maskChar = null,
  name,
  placeholder,
  onChange,
  icon = "",
  className,
  style,
  disabled,
  disabledStyle = true,
  error,
  id,
  type = "text",
  endAdornment,
  ...rest
}) {
  const [inputType, setInputType] = useState(type)

  const changeVisibility = () => {
    setInputType((prev) => {
      if (prev === "text") return "password"
      else if (prev === "password") return "text"
    })
  }

  return (
    <div
      className={`
                Input
                border 
                bg-white
                flex
                space-x-2
                items-center
                rounded-lg
                text-body
                relative
                p-1
                px-2
                w-full
                font-smaller
                focus-within:ring
                focus-within:outline-none
                transition
                focus-within:border-blue-300
                h-10
                ${error ? "border-red-600" : "border-gray-200"}
                ${className}
            `}
      style={style}
    >
      <div>{icon}</div>
      {/* <input type={inputType} style={{ flex: 1 }} {...rest}></input> */}
      <InputMask
        id={id}
        mask={mask}
        maskChar={maskChar}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        {...rest}
      />
      {endAdornment && (
        <div
          className="pl-2"
          style={{ borderLeft: "1px solid #bfbfbf", color: "#8c8c8c" }}
        >
          {endAdornment}
        </div>
      )}
      {disabled ? (
        <div
          className="absolute inset-0 rounded-md cursor-not-allowed"
          style={{
            backgroundColor: `${disabledStyle && "rgba(221, 226, 228, 0.5)"}`,
            margin: 0,
          }}
        />
      ) : (
        <></>
      )}
      {type === "password" ? (
        <div
          className={`visibility-btn ${inputType === "text" ? "active" : ""}`}
          onClick={changeVisibility}
        >
          <VisibilityIcon style={{ fontSize: "18px" }} />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
