import { Box } from "@mui/material";
import { store } from "../../../store";
import styles from "../index.module.scss";

const MessageCard = ({ item, idx }) => {
  const authStore = store.getState().auth;
  return (
    <Box
      className={styles.message}
      key={idx}
      style={
        authStore?.userId === item?.user_id ||
        item?.platform_type === "to_telegram_bot"
          ? {
              flexDirection: "row-reverse",
              marginLeft: "auto",
            }
          : {}
      }
    >
      <img alt="avatarka" src="/img/AvatarPhoto.png" />
      <Box
        className={styles.info}
        style={{
          background:
            authStore.userId === item.user_id ||
            item?.platform_type === "to_telegram_bot"
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
    </Box>
  );
};

export default MessageCard;
