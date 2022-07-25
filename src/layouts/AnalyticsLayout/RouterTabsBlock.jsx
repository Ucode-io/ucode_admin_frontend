import { useSelector } from "react-redux"
import AppSelector from "../../components/AppSelector"
import ExitButton from "../../components/Buttons/ExitButton"
import UserAvatar from "../../components/UserAvatar"
import RouteTabComponent from "./RouteTabComponent"
import styles from "./style.module.scss"

const RouterTabsBlock = () => {
  const tabs = useSelector((state) => state.tabRouter.tabs)

  return (
    <div className={styles.tabsBlock}>
      <div className={styles.leftSide}>
        {tabs.map((tab) => (
          <RouteTabComponent key={tab.id} tab={tab} />
        ))}

        {/* <FormSelector /> */}
      </div>

      <div className={styles.rightSide}>
        <AppSelector />
        <ExitButton />
        <UserAvatar
          user={{
            name: "User",
            photo_url: "https://image.emojisky.com/71/8041071-middle.png",
          }}
        />
      </div>
    </div>
  )
}

export default RouterTabsBlock
