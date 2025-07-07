import {Box} from "@mui/material";
import React, {useState} from "react";
import OtpInput from "react-otp-input";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import styles from "../style.module.scss";
import {useTranslation} from "react-i18next";

function FireBaseOtp({
  watch,
  control,
  loading = false,
  setFormType = () => {},
  setCodeAppValue = () => {},
  setValue = () => {},
}) {
  const [otp, setOtp] = useState("");
  const {t} = useTranslation();

  const getOtpVal = (val) => {
    setOtp(val);
    setValue("otp", val);
    setValue("firebase", true);
  };

  const backToLogin = () => {
    setOtp("");
    setCodeAppValue({});
    setFormType("LOGIN");
    setValue("recipient", "");
  };

  return (
    <>
      <Box className={styles.otpBackBtnFirebase} onClick={backToLogin}>
        {t("to.login")}
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "86px",
          textAlign: "center",
        }}>
        <h3
          style={{
            fontSize: "24px",
            color: "#101828",
            marginBottom: "8px",
          }}>
          {}
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: "#101828",
            marginBottom: "4px",
          }}>
          {t("to.phone.number")}
        </p>
        <p
          style={{
            fontSize: "16px",
            color: "#101828",
          }}>
          {watch("recipient", control)}
        </p>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "24px 0",
        }}>
        <OtpInput
          value={otp}
          onChange={getOtpVal}
          numInputs={6}
          renderSeparator={<span style={{width: "14px"}}></span>}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            border: "1px solid #D0D5DD",
            borderRadius: "8px",
            width: "60px",
            height: "60px",
            fontSize: "48px",
            color: "#000",
            fontWeight: "400",
            caretColor: "blue",
          }}
        />
      </Box>
      <Box sx={{textAlign: "center"}}>
        {/* <p
          style={{
            fontSize: "16px",
            color: "#475467",
            cursor: "pointer",
          }}>
          {t("send.again")}
        </p> */}
        <PrimaryButton
          size="large"
          style={{
            width: "100%",
            marginTop: "24px",
            borderRadius: "8px",
          }}
          loader={loading}>
          {t("confirm")}
        </PrimaryButton>
      </Box>
    </>
  );
}

export default FireBaseOtp;
