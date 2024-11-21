import React, {useState} from "react";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import {useGoogleLogin} from "@react-oauth/google";

function GoogleAuthLogin({
  getCompany = () => {},
  text = "",
  setValue = () => {},
  watch = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

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
        loading={loading}>
        <img src="/img/google.svg" alt="" />
        {text ? text : "Continue with Google"}
      </PrimaryButton>
    </>
  );
}

export default GoogleAuthLogin;
