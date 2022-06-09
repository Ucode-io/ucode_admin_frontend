import { Outlet } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import RouterTabsBlock from "./RouterTabsBlock"
import styles from "./style.module.scss"

const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>

        <RouterTabsBlock />

        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
