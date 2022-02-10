export default function Filters({ extra, children, className, style }) {
  return (
    <div
      className={`h-14 w-full flex items-center font-body border-b bg-white border-t ${className}`}
      style={{ ...style }}
    >
      <div className="flex justify-between w-full items-center px-4">
        <div>{children}</div>
        <div>{extra}</div>
      </div>
    </div>
  )
}
