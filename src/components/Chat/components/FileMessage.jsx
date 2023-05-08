import { Box } from "@mui/material";
import styles from "../index.module.scss";
import { store } from "../../../store";

const FileMessage = ({ item }) => {
  const authStore = store.getState().auth;
  return (
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
        <Box display={"flex"} alignItems={"center"}>
          <Box width={"100px"} height={"100px"}>
            <iframe
              src={item.message}
              width="100%"
              height="100%"
              style={{
                cursor: "pointer",
                objectFit: "contain",
                borderRadius: "10px",
              }}
              title="Test"
            ></iframe>
          </Box>
          <div>
            <a
              className={styles.desc}
              href={item.message}
              style={{
                color: "blue",
              }}
              rel="noreferrer"
              target="_blank"
            >
              {item.message}
            </a>
            <p className={styles.time}>{item.created_at?.slice(11, 16)}</p>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default FileMessage;
