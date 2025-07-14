import styles from "./styles.module.scss";
import {useState} from "react";
import LoginFormDesign from "../components/LoginFormDesign";
import clsx from "clsx";

const LoginDesign = () => {
  const [index, setIndex] = useState(0);
  const [formType, setFormType] = useState("LOGIN");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <>
      <div
        className={clsx(styles.outletWrapper, styles.outlet, {
          [styles.outletSecond]: formType === "OTP" || formType === "EMAIL_OTP",
          [styles.outletPhone]: formType === "phone" || formType === "email",
          [styles.outletForgot]: formType === "FORGOT_PASSWORD",
        })}
      >
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
