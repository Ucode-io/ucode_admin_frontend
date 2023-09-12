import {Outlet, useLocation, useParams} from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Sidebar2222 from "../../components/Sidebar2222";
import styles from "./style.module.scss";
import Favicon from "react-favicon";

const SettingsLayout = ({favicon}) => {
  const profilePath = useLocation();

  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchConstructorTableListAction())
  // }, [dispatch])

  return (
    <div className={styles.layout}>
      <Favicon url={favicon} />
      {!profilePath?.pathname?.includes("profile") && (
        <Sidebar2222 favicon={favicon} />
      )}
      <div className={styles.content}>
        {/* <RouterTabsBlock /> */}

        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;
