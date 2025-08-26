import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: true,
      });

      window.google.accounts.id.prompt();
    }
  }, []);

  const handleCredentialResponse = (response) => {
    setLoading(true);

    const credential = response.credential;

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

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setLoading(false);
      setData(tokenResponse);
      setValue("googleToken", tokenResponse);
      getCompany({
        type: "google",
        google_token: tokenResponse?.access_token,
      });
    },
    onError: (err) => {
      setLoading(false);
    },
  });

  return (
    <>
      <PrimaryButton
        disabled={loading || Boolean(watch("googleToken"))}
        onClick={() => {
          setLoading(true);
          login();
        }}
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
        type={"button"}
        loading={loading}
      >
        <img src="/img/google.svg" alt="" />
        {text ? text : t("google.continue")}
      </PrimaryButton>
    </>
  );
}

export default GoogleAuthLogin;
