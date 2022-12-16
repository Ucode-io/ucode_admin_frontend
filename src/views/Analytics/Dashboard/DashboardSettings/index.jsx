import { useTranslation } from "react-i18next"
import { Outlet, useParams } from "react-router-dom"
import Header from "../../../../components/Header"
import SettingsSidebar from "../../components/SettingsSidebar"
import styles from "./style.module.scss"

const DashboardSettings = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  return (
    <div>
      <Header
        title={`${t("home")} / ${t("settings")}`}
        backButtonLink={`/analytics/dashboard/${id}`}
      />

      <div className="p-2">
        <div className={styles.card}>
          <SettingsSidebar />

          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardSettings
