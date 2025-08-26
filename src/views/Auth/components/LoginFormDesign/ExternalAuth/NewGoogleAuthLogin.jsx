import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import { useTranslation } from "react-i18next";

function GoogleAuthLogin({
  getCompany = () => {},
  text = "",
  setValue = () => {},
  watch = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    /* Инициализация Google One Tap */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, // ⚡ Ваш CLIENT_ID
        callback: handleCredentialResponse,
        auto_select: true, // если у пользователя один аккаунт, покажет сразу
      });

      /* Отображение One Tap Popup */
      window.google.accounts.id.prompt();
    }
  }, []);

  const handleCredentialResponse = (response) => {
    setLoading(true);

    // JWT токен Google
    const credential = response.credential;

    // Здесь можно получить email и имя пользователя
    const payload = JSON.parse(atob(credential.split(".")[1]));
    console.log("Google User:", payload);

    setData({ credential, email: payload.email });
    setValue("googleToken", credential);

    getCompany({
      type: "google",
      google_token: credential,
    });

    setLoading(false);
  };

  return (
    <>
      <PrimaryButton
        disabled={loading || Boolean(watch("googleToken"))}
        size="large"
        style={{
          width: "100%",
          marginTop: "14px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #D0D5DD",
          color: "#344054",
          fontWeight: "600",
          fontSize: "14px",
        }}
        type="button"
        loading={loading}
        onClick={() => {
          if (window.google) {
            window.google.accounts.id.prompt();
          }
        }}
      >
        <img src="/img/google.svg" alt="google" />
        {text ? text : t("google.continue")}
      </PrimaryButton>
    </>
  );
}

export default GoogleAuthLogin;
