import { Outlet } from "react-router-dom"
import styles from "./style.module.scss"

const AuthLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.leftSide}>
        <div></div>
        <div className={styles.logoBlock}>
          <h1 className={styles.logoTitle}>Medion</h1>
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
