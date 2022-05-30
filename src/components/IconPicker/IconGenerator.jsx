import { memo } from "react"
import SVG from "react-inlinesvg"

const IconGenerator = ({ icon, size=20, ...props }) => {
  if (!icon) return null

  return (
    <SVG
      src={`https://cdn.upm.udevs.io/icons/${icon}`}
      width={size}
      height={size}
      preProcessor={(code) =>
        code.replace('path', 'path fill="currentColor"')
      }
      {...props}
    />
  )
}

export default memo(IconGenerator)
