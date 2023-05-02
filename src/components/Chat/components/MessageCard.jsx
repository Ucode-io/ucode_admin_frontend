import { Box } from "@mui/material";
import { store } from "../../../store";
import styles from "../index.module.scss";
import MessageTypes from "./MessageType";

const MessageCard = ({ item, idx }) => {
  const authStore = store.getState().auth;

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
      <MessageTypes item={item} />
    </Box>
  );
};

export default MessageCard;
