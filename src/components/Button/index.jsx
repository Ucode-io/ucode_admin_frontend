// import { makeStyles } from "@material-ui/core/styles";
// import LinearProgress from "@material-ui/core/LinearProgress";
import "./index.scss"
import { CircularProgress } from "@material-ui/core"

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "100%",
//     "& > * + *": {
//       marginTop: theme.spacing(2),
//     },
//   },
// }));

export default function Button({
  className = "",
  style,
  children,
  icon: Icon,
  color = "blue",
  iconClassName,
  loading = false,
  shape = "filled",
  borderWidth = 2,
  position = "left",
  size = "medium",
  borderType = "rounded",
  disabled = false,
  borderColor,
  classNameParent = "",
  ...rest
}) {
  const textColors = (key) => `text-${key}-600`

  const bgColors = (key) => `bg-${key}-600`

  const borderColors = {
    bordercolor: "border-bordercolor",
    blue: "border-blue-600",
    red: "border-red-600",
  }

  const getSize = (key) => {
    switch (key) {
      case "small":
        return {
          size: "h-8 px-3 py-2",
          fontSize: "text-xs",
          radius: "rounded-md",
        }
      case "medium":
        return {
          size: "h-9 px-3 py-1 min:w-7",
          fontSize: "text-sm",
          radius: "rounded-md",
        }
      case "large":
        return {
          size: "h-10 px-5 py-1.5",
          fontSize: "text-sm",
          radius: "rounded-md",
        }

      default:
        break
    }
  }

  const getShape = (key) => {
    // console.log(key);
    switch (key) {
      case "filled":
        return {
          color: `${bgColors(
            color
          )} text-white iconColor-filled hover:opacity-90 border ${
            borderColors[borderColor ?? color]
          }`,
          background: "",
        }
      case "outlined":
        return {
          color: `bg-transparent ${textColors(color)} border ${
            borderColors[borderColor ?? color]
          } hover:bg-background_2`,
        }
      // return {
      //   color: `bg-transparent text-red-600 border border-red-600 hover:bg-background_2`,
      // }
      case "text":
        return {
          color: `bg-transparent ${textColors(
            color
          )} hover:opacity-90 border border-transparent`,
        }

      default:
        return {
          color: `${bgColors(
            color
          )} text-white iconColor-filled hover:opacity-90 border ${
            borderColors[borderColor ?? color]
          }`,
          background: "",
        }
    }
  }

  const iconClasses = `fill-current flex flex-column justify-center ${
    iconClassName ?? `text-${color}-600`
  }`

  return (
    <div className={classNameParent}>
      <button
        disabled={disabled || loading}
        type="button"
        style={style}
        className={`
          button
          ${className}
          focus:outline-none
          transition
          ${children ? "" : "w-9 h-9"}
          focus:ring-2 focus:border-blue-300 
          focus-within:z-40
          ${getShape(shape).color}
          ${getSize(size).size}
          ${borderType === "rectangle" ? "rounded-none" : getSize(size).radius}
          ${disabled || loading ? "disabled" : ""}
        `}
        {...rest}
      >
        <div
          className={`flex items-center justify-center ${
            children ? "space-x-2" : ""
          } font-medium`}
        >
          {loading && <CircularProgress size={16} color="#fff" />}
          {Icon && position === "left" && (
            <div className={iconClasses}>
              <Icon style={{ fontSize: "18px" }} />
            </div>
          )}
          <div className={getSize(size).fontSize}>{children}</div>
          {Icon && position === "right" && (
            <div className={iconClasses}>
              <Icon style={{ fontSize: "18px" }} />
            </div>
          )}
        </div>
      </button>
    </div>
  )
}
