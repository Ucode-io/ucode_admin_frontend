import React from "react";
import ChatwootLoginPage from "./ChatWootLoginPage";
import PrimaryButton from "../../../../../../components/Buttons/PrimaryButton";

function ChatwootLogin() {
  return (
    <>
      <PrimaryButton
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
        <p style={{fontSize: "14px", color: "#344054"}}>Support</p>
        <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
          <p style={{fontSize: "14px", color: "#344054"}}> +998 99-865-01-09</p>
          <ChatwootLoginPage />
        </div>
      </PrimaryButton>
    </>
  );
}

export default ChatwootLogin;
