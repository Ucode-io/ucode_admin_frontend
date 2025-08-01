import {Box, Paper, Typography} from "@mui/material";
import React from "react";
import Typewriter from "./TypeWriter";
import styles from "./style.module.scss";
import { ChatBox } from "./components/ChatBox";

function Loader() {
  return (
    <div
      className={styles.animated_text}
      sx={{fontSize: "12px", fontWeight: "bold"}}>
      Analyzing...
    </div>
  );
}

function GptChat({index, msg}) {
  return (
    <ChatBox>
      {msg.errorText ? (
        <Typography sx={{ fontSize: "14px", color: "red" }}>
          {msg.errorText}
        </Typography>
      ) : msg.type === "loader" ? (
        <Loader />
      ) : msg.content ? (
        <Typography
          sx={{
            fontSize: "14px",
            padding: "5px 10px",
            backgroundColor: "#F5F6FA",
            borderRadius: "10px",
          }}
        >
          <Typewriter text={msg?.text} />
          {msg.content}
        </Typography>
      ) : (
        <Typography sx={{ fontSize: "14px" }}>
          <Typewriter text={msg.text} delay={69} />
        </Typography>
      )}
    </ChatBox>
  );
}

export default GptChat;
