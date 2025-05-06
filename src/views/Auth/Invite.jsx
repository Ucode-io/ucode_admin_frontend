import {useTranslation} from "react-i18next";
import styles from "./style.module.scss";
import InviteForm from "./components/InviteForm";

const Invite = () => {
  const {t} = useTranslation();

  return (
    <div className={styles.outletInvite}>
      <h1 className={styles.title}>Invite</h1>

      <InviteForm />
    </div>
  );
};

export default Invite;
