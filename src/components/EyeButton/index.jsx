import "./style.scss"
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useHistory } from "react-router-dom";


const EyeButton = ({url}) => {
  const history = useHistory()

  return (
    <div className="EyeButton" onClick={()=>history.push(url)}>
      <VisibilityIcon style={{ fontSize: 16 }} />
    </div>
  )
}

export default EyeButton
