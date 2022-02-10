import { Alert } from "@material-ui/lab"
import "./style.scss"
// import Button from "../../components/Buttons"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

const ChangePasswordAlert = () => {
  const token = useSelector(state => state.auth.accessToken)
  const verified = useSelector(state => state.auth.verified)

  if(!token || verified) return null
  
  return (
    <div className="alerts fixed right-5 bottom-10 shake-animation" >
      <Alert
        severity="error"
        style={{ padding: "10px 30px" }}
        className="mb-3 alert-pulse-animation"
      >
        <div className="flex flex-col align-center ">
          <p>Iltimos parolingizni o'zgartiring!</p>
          <div className="flex justify-center pt-4">
            <Link className="link" to="/home/profile">O'zgartirish</Link>
          </div>
        </div>
      </Alert>
    </div>
  )
}

export default ChangePasswordAlert
