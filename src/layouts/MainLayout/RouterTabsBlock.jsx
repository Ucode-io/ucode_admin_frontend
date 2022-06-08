import { useSelector } from "react-redux";
import FormSelector from "../../components/FormSelector";
import RouteTabComponent from "./RouteTabComponent";
import styles from "./style.module.scss";

const RouterTabsBlock = () => {
  const tabs = useSelector((state) => state.tabRouter.tabs);

  return ( <div className={styles.tabsBlock} >

    {
      tabs.map(tab => (
        <RouteTabComponent key={tab.id} tab={tab} />
      ))
    }


    <FormSelector />

  </div> );
}
 
export default RouterTabsBlock;