import styles from "./styles.module.scss";
import {useState} from "react";
import LoginFormDesign from "../components/LoginFormDesign";

const LoginDesign = () => {
  const [index, setIndex] = useState(0);
  const [formType, setFormType] = useState("LOGIN");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <>
      <div
        className={
          formType === "OTP" || formType === "EMAIL_OTP"
            ? styles.outletSecond
            : formType === "phone" || formType === "email"
              ? styles.outletPhone
              : formType === "FORGOT_PASSWORD"
                ? styles.outletForgot
                : styles.outlet
        }>
        <div className={styles.page}>
          <LoginFormDesign
            setFormType={setFormType}
            formType={formType}
            setIndex={setIndex}
            index={index}
            selectedTabIndex={selectedTabIndex}
            setSelectedTabIndex={setSelectedTabIndex}
          />
        </div>
      </div>
    </>
  );
};

export default LoginDesign;
