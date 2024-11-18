import React, {useState} from "react";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import {useGoogleLogin} from "@react-oauth/google";
import {Box, Tooltip} from "@mui/material";

function GoogleAuthLogin({getCompany = () => {}}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("GOOGLE AUTH REPONSE", tokenResponse);
      setLoading(false);
      setData(tokenResponse);
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
        disabled={loading}
        // disabled={true}
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
        Продолжить с Google
      </PrimaryButton>
    </>
  );
}

export default GoogleAuthLogin;
