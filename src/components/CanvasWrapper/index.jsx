

export default function CanvasWrapper ({
  sidebarVisible = false,
  children
}) {


  return (
    <div className="w-full h-full overflow-x-hidden">
      {/* <div>This is Canvas</div> */}
      {children}
    </div>
  )
}