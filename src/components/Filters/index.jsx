export default function Filters({ extra, children, className, style }) {
  return (
    <div
      className={`h-14 w-full flex items-center font-body border-b bg-white p-1.25 ${className}`}
      style={{ ...style }}
    >
      <div className="flex justify-between w-full items-center pl-5">
        <div>{children}</div>
        <div>{extra}</div>
      </div>
    </div>
  )
}
