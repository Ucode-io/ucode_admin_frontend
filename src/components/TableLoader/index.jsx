import { CircularProgress } from "@material-ui/core"


const TableLoader = ({isVisible = true, type = "table"}) => {

  if(!isVisible) return null

  return (
    <div className="flex justify-center align-center py-10">
      <CircularProgress  />
    </div>
  )
}

export default TableLoader
