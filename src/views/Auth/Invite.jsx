import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector";
import styles from "./style.module.scss";
import { useState } from "react";
import InviteForm from "./components/InviteForm";

const Invite = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [formType, setFormType] = useState("LOGIN");

  return (
    <div className={styles.page}>
      <div style={{ marginLeft: "auto" }}>
        <LanguageSelector />
      </div>
      <h1 className={styles.title}>Invite</h1>
      <p className={styles.subtitle}>
        {index === 0 ? t("fill.in.your.login.info") : t("register.form.desc")}
      </p>

      <InviteForm
        setFormType={setFormType}
        formType={formType}
        setIndex={setIndex}
        index={index}
      />
    </div>
  );
};

export default Invite;
