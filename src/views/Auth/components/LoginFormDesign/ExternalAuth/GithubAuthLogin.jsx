import React from "react";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import GitHubLogin from "react-github-login";
import styles from "../style.module.scss";
import ChatwootLogin from "./ChatWootLogin";

const GITHUB_CLIENT_ID = "Ov23liNemzMeOch68s4f";
const REDIRECT_URI = "http://localhost:7777";

function GithubAuthLogin() {
  const onSuccess = (response) =>
    console.log("GITHUB LOGIN RESPONSE===>", response);
  const onFailure = (response) => console.error(response);

  return (
    <>
      <PrimaryButton
        // disabled={true}
        size="large"
        style={{
          width: "100%",
          marginTop: "14px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #D0D5DD",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        type="button">
        {/* <img src="/img/github.svg" alt="" /> */}
        <p style={{fontSize: "14px", color: "#344054"}}>Support</p>
        <div
          style={{display: "flex", alignItems: "center", gap: "15px"}}
          // className={styles.githubLoginBtn}
        >
          <p style={{fontSize: "14px", color: "#344054"}}> +998 99-865-01-09</p>
          {/* <img src="/img/chatwoot.svg" width={24} height={24} alt="" /> */}
          <ChatwootLogin />
          {/* <GitHubLogin
            clientId={GITHUB_CLIENT_ID}
            onSuccess={onSuccess}
            onFailure={onFailure}
            redirectUri={REDIRECT_URI}
            buttonText="Продолжить с GitHub"
          /> */}
        </div>
      </PrimaryButton>
    </>
  );
}

export default GithubAuthLogin;
