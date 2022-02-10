export default function TagBtn({
  children,
  iconRight,
  iconLeft,
  color,
  bgColor,
}) {
  return (
    <div
      style={{ color, background: bgColor }}
      className="text-sm font-medium flex items-center justify-center py-1.5 px-3 w-40 h-10 rounded-md cursor-pointer"
    >
      {iconLeft} {children} {iconRight}
    </div>
  )
}
