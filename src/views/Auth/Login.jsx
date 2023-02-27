import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector";
import LoginForm from "./components/LoginForm";
import styles from "./style.module.scss";

const Login = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div style={{ marginLeft: 'auto' }} ><LanguageSelector /></div>
      <h1 className={styles.title}>{t("enter.to.system")}</h1>
      <p className={styles.subtitle}>{t("fill.in.your.login.info")}</p>

      <LoginForm />
    </div>
  );
};

export default Login;
