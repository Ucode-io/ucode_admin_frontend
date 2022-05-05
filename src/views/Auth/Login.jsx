import { KeyOutlined } from "@mui/icons-material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ESPLoginForm from "./components/ESPLoginForm"
import LoginForm from "./components/LoginForm"
import styles from "./style.module.scss"

const Login = () => {
  const navigate = useNavigate()
  const [loginType, setLoginType] = useState("LOGIN")
 
  const onESPFormSelected = () => setLoginType("ESP")
  const onLoginFormSelected = () => setLoginType("LOGIN")

  const navigateToRegistrationForm = () => navigate("/registration")
  
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Вход в систему</h1>
      <p className={styles.subtitle}>
        Выберите тип авторизации и заполните данные для входа в аккаунт
      </p>

      {/* <div className={styles.typeSwitchRow}>
        <div
          className={`${styles.typeSwitchButton} ${
            loginType === "ESP" ? styles.active : ""
          }`}
          onClick={onESPFormSelected}
        >
          <div className={styles.typeSwitchButtonLabel}>EMAIL</div>
          <KeyOutlined />
        </div>
        <div
          className={`${styles.typeSwitchButton} ${
            loginType === "LOGIN" ? styles.active : ""
          }`}
          onClick={onLoginFormSelected}
        >
          <div className={styles.typeSwitchButtonLabel}>Логин</div>
          <KeyOutlined />
        </div>
      </div> */}

      {loginType === "ESP" ? (
        <ESPLoginForm navigateToRegistrationForm={navigateToRegistrationForm} />
      ) : (
        <LoginForm navigateToRegistrationForm={navigateToRegistrationForm} />
      )}
    </div>
  )
}

export default Login
