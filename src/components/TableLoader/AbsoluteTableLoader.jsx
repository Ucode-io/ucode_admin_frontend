import { CircularProgress } from "@material-ui/core"
import "./style.scss"

const AbsoluteTableLoader = ({isVisible = true}) => {

  if(!isVisible) return null

  return (
    <div className="AbsoluteTableLoader" >
      <CircularProgress  />
    </div>
  )
}

export default AbsoluteTableLoader
