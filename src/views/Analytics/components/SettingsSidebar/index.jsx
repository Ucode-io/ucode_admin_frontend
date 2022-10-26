import { Calculate, Tune } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { NavLink, useParams } from "react-router-dom"
import styles from "./style.module.scss"

const SettingsSidebar = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  return (
    <div className={styles.sidebar}>
      <NavLink
        to={`/analytics/dashboard/${id}/settings/main`}
        className={({ isActive }) =>
          !isActive ? styles.element : `${styles.element} ${styles.active}`
        }
      >
        <Tune className={styles.icon} />

        <div className={styles.title}>{t("generals")}</div>
      </NavLink>

      <NavLink
        to={`/analytics/dashboard/${id}/settings/variables`}
        className={({ isActive }) =>
          !isActive ? styles.element : `${styles.element} ${styles.active}`
        }
      >
        <Calculate className={styles.icon} />

        <div className={styles.title}>{t("variables")}</div>
      </NavLink>
    </div>
  )
}

export default SettingsSidebar
