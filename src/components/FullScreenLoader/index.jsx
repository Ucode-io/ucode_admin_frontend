import { CircularProgress } from "@material-ui/core"
import "./style.scss"

const FullScreenLoader = () => {
  return (
    <div className="FullScreenLoader bg-background">
      <CircularProgress />
    </div>
  )
}

export default FullScreenLoader
