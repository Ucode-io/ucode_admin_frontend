import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../index.module.scss";

const UserCard = ({ item, idx, setOnRequest }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  return (
    <Box
      className={styles.card}
      key={item.chat_id}
      onClick={() => {
        navigate(`/chat/${item.chat_id}`);
        setOnRequest(true);
      }}
    >
      <img alt="avatarka" src="/img/AvatarPhoto.png" />
      <Box className={styles.info}>
        <Box
          alignItems={"center"}
          display="flex"
          justifyContent="space-between"
        >
          <p className={styles.name}>{item?.sender_name}</p>
          <p className={styles.time}>{item?.created_at.slice(0, 10)}</p>
        </Box>
        <p className={styles.message}>
          {item?.message.type || "Message is empty!"}
        </p>
      </Box>
    </Box>
  );
};

export default UserCard;
