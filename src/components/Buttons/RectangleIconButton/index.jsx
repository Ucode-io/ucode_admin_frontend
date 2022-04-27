import { CircularProgress } from "@mui/material"
import "./style.scss"

const RectangleIconButton = ({
  color,
  children,
  loader,
  onClick = () => {},
  ...props
}) => {
  return (
    <div
      className={`RectangleIconButton ${color}`}
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
      {...props}
    >
      {loader ? <CircularProgress size={14} /> : children}
    </div>
  )
}

export default RectangleIconButton
