import styles from "./style.module.scss";
import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function UserChat({ msg, index }) {
  const userInfo = useSelector((state) => state?.auth?.userInfo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "10px",
          justifyContent: "flex-end",
        }}
      >
        <Paper
          sx={{
            padding: "10px",
            backgroundColor: "#F4F4F4",
            alignSelf: "flex-end",
            maxWidth: "70%",
            color: "#000",
            borderRadius: "20px",
            padding: "10px 10px 10px 10px",
            minHeight: "40px",
            marginRight: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              padding: "5px 10px",
              whiteSpace: "pre-line",
            }}
          >
            {msg.text}
          </Typography>
        </Paper>
        <div className={styles.avatar}>{userInfo?.login?.[0]}</div>
        {/* <AccountCircleIcon sx={{ width: "24px", height: "24px" }} /> */}
      </Box>
    </motion.div>
  );
}

export default UserChat;
