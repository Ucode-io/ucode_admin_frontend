import { useSelector } from "react-redux"
import AppSelector from "../../components/AppSelector"
import RouteTabComponent from "./RouteTabComponent"
import styles from "./style.module.scss"

const RouterTabsBlock = () => {
  const tabs = useSelector((state) => state.tabRouter.tabs)

  return (
    <div className={styles.tabsBlock}>
      <div className={styles.leftSide} >
        {tabs.map((tab) => (
          <RouteTabComponent key={tab.id} tab={tab} />
        ))}

        {/* <FormSelector /> */}
      </div>

      <div className={styles.rightSide} >
        <AppSelector />
      </div>
    </div>
  )
}

export default RouterTabsBlock
