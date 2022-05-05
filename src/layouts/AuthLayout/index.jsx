import { Outlet } from "react-router-dom"
import styles from "./style.module.scss"
import Logo from '../../assets/icons/soliq-logo.svg'

const AuthLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.leftSide}>
        <div></div>
        <div className={styles.logoBlock}>
          {/* <img src={Logo} className={styles.logoIcon} alt="logo" /> */}
          <h1 className={styles.logoTitle}>Medion</h1>
          <p className={styles.logoSubtitle} >Family Hospital</p>
        </div>

        <div className={styles.subtitleBlock}>© Medion. Все права защищены</div>

      </div>
      <div className={styles.rightSide}>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
