import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";
import config from "../../../builder_config/config.json";
import { useLoginMicrofrontendQuery } from "../../services/loginMicrofrontendService";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import Microfrontend from "../../views/Microfrontend";
import MicrofrontendComponent from "../../components/MicrofrontendComponent";

const AuthLayout = () => {
  const subdomain =
    window.location.hostname === "localhost"
      ? "ett.u-code.io"
      : window.location.hostname;

  const { data, isLoading } = useLoginMicrofrontendQuery({
    params: {
      subdomain,
    },
  });

  const microfrontendUrl = data?.function?.url;
  const microfrontendLink = microfrontendUrl
    ? `https://${microfrontendUrl}/assets/remoteEntry.js`
    : undefined;

  if (isLoading) return <RingLoaderWithWrapper style={{ height: "100vh" }} />;

  // if(microfrontendUrl) return <MicrofrontendComponent key={microfrontendLink} link={microfrontendLink} />

  return (
    <div className={styles.layout}>
      <div className={styles.leftSide}>
        <div></div>
        <div className={styles.logoBlock}>
          <h1 className={styles.logoTitle}>{config?.company_name}</h1>
          <p className={styles.logoSubtitle}>{config?.company_subtitle}</p>
        </div>

        <div className={styles.subtitleBlock}>
          © {config?.company_name}. Все права защищены
        </div>
      </div>
      <div className={styles.rightSide}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
