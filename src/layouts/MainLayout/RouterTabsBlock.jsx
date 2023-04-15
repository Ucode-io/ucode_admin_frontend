import { useSelector } from "react-redux";
import AppSelector from "../../components/AppSelector";
import ChatRouter from "../../components/Chat/components/ChatRouter";
import FormSelector from "../../components/FormSelector";
import LanguageSelector from "../../components/LanguageSelector";
import ProfilePanel from "../../components/ProfilePanel";
import Notifications from "./Notification";
import RouteTabComponent from "./RouteTabComponent";
import styles from "./style.module.scss";

const RouterTabsBlock = () => {
  const tabs = useSelector((state) => state.tabRouter.tabs);

  return (
    <div className={styles.tabsBlock}>
      <div className={styles.leftSide}>
        {tabs.map((tab) => (
          <RouteTabComponent key={tab.id} tab={tab} />
        ))}

        <FormSelector />
      </div>

      <div className={styles.rightSide}>
        <LanguageSelector />
        <ChatRouter />
        <Notifications />
        <AppSelector />
        <ProfilePanel />
      </div>
    </div>
  );
};

export default RouterTabsBlock;
