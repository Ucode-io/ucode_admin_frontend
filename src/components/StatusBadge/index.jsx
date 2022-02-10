export default function StatusBadge({ children, className, width, shape = "filled", color, ...rest }) {

  const getShape = (key) => {
    switch (key) {
      case "filled":
        return {
          color: `bg-${color}-100 text-${color}-600`,
          background: ""
        }
      default:
        return { color: "text-gray" }
    }
  }

  return (
    <div className={`
      py-1
      rounded
      text-md
      text-center
      w-6/12
      ${getShape(shape).color}
      ${className}
    `}
         {...rest}
    >
      {children}
    </div>
  )
}