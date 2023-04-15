import styles from "../index.module.scss";
// import { BsPlusLg } from "react-icons/bs";
// import { GoSettings } from "react-icons/go";
import UserCard from "../components/UserCard";
import { Box } from "@mui/material";
import SearchInput from "../../SearchInput";

const ChatSidebar = ({ chats, setOnRequest }) => {
  return (
    <Box className={styles.sidebar}>
      <Box w={"100%"} bgColor="#fff" className={styles.collapse}>
        <Box className={styles.header}>
          <SearchInput
            className={styles.input}
            placeholder="Поиск"
            iconColor="#000"
          />
          <Box className={styles.setting}>
            {/* <BsPlusLg /> */}
            {/* <GoSettings /> */}
          </Box>
        </Box>
        <Box className={styles.chat}>
          {chats?.chats?.map((item, idx) => (
            <UserCard item={item} idx={idx} setOnRequest={setOnRequest} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatSidebar;
