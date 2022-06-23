import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import { fetchConstructorTableListAction } from "../../store/constructorTable/constructorTable.thunk"
import RouterTabsBlock from "./RouterTabsBlock"
import styles from "./style.module.scss"

const MainLayout = () => {
  const {appId} = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchConstructorTableListAction(appId))
  }, [dispatch, appId])

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
