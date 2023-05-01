import { Box, Link, Modal, Typography } from "@mui/material";
import { store } from "../../../store";
import styles from "../index.module.scss";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "70%",
  display: "flex",
  alignItems: "center",
  objectFit: "contain",
  outline: "none !important",
  p: 4,
};

const MessageCard = ({ item, idx }) => {
  const authStore = store.getState().auth;
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box
      className={styles.message}
      key={idx}
      style={
        authStore?.userId === item?.user_id ||
        item?.platform_type === "to_telegram_bot" ||
        item?.sender_name === "Admin"
          ? {
              flexDirection: "row-reverse",
              marginLeft: "auto",
            }
          : {}
      }
    >
      <img alt="avatarka" src="/img/AvatarPhoto.png" />
      {item.message_type === "photo" ? (
        <>
          <img
            src={item.message}
            alt="test"
            style={{
              borderRadius: "20px",
            }}
            onClick={() => setOpen(true)}
          />
          <Modal open={open} onClose={handleClose}>
            <img
              src={item.message}
              alt="test"
              style={style}
              className={styles.img}
            />
          </Modal>
        </>
      ) : item.message_type === "video" ? (
        <video
          src={item.message}
          alt="test"
          controls
          style={{
            borderRadius: "20px",
          }}
        />
      ) : item.message_type === "document" ? (
        // <iframe src={item.message}></iframe>
        <>
          <Box
            className={styles.info}
            style={{
              background:
                authStore.userId === item.user_id ||
                item?.platform_type === "to_telegram_bot" ||
                item?.sender_name === "Admin"
                  ? "#F2F8F8"
                  : "#E1EDFD",
            }}
          >
            <Box
              alignItems={"center"}
              display="flex"
              justifyContent="space-between"
            >
              <p className={styles.name}>{item.sender_name}</p>
            </Box>
            <a
              className={styles.desc}
              href={item.message}
              style={
                item.message_type === "document" && {
                  color: "blue",
                }
              }
              rel="noreferrer"
              target="_blank"
            >
              {item.message}
            </a>
            <p className={styles.time}>{item.created_at?.slice(11, 16)}</p>
          </Box>
        </>
      ) : (
        <Box
          className={styles.info}
          style={{
            background:
              authStore.userId === item.user_id ||
              item?.platform_type === "to_telegram_bot" ||
              item?.sender_name === "Admin"
                ? "#F2F8F8"
                : "#E1EDFD",
          }}
        >
          <Box
            alignItems={"center"}
            display="flex"
            justifyContent="space-between"
          >
            <p className={styles.name}>{item.sender_name}</p>
          </Box>
          <p className={styles.desc}>{item.message || "Message is empty!"}</p>
          <p className={styles.time}>{item.created_at?.slice(11, 16)}</p>
        </Box>
      )}
    </Box>
  );
};

export default MessageCard;
