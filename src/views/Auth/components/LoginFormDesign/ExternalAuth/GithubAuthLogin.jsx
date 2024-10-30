import React from "react";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import GitHubLogin from "react-github-login";
import styles from "../style.module.scss";

const GITHUB_CLIENT_ID = "Ov23liNemzMeOch68s4f";
const REDIRECT_URI = "http://localhost:7777";

function GithubAuthLogin() {
  const onSuccess = (response) =>
    console.log("GITHUB LOGIN RESPONSE===>", response);
  const onFailure = (response) => console.error(response);

  return (
    <>
      <PrimaryButton
        disabled={true}
        size="large"
        style={{
          width: "100%",
          marginTop: "14px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #D0D5DD",
        }}
        type="button">
        <img src="/img/github.svg" alt="" />

        <div className={styles.githubLoginBtn}>
          <GitHubLogin
            clientId={GITHUB_CLIENT_ID}
            onSuccess={onSuccess}
            onFailure={onFailure}
            redirectUri={REDIRECT_URI}
            buttonText="Продолжить с GitHub"
          />
        </div>
      </PrimaryButton>
    </>
  );
}

export default GithubAuthLogin;
