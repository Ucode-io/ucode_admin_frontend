import styles from "../index.module.scss";
// import { AiOutlineCheck, AiOutlinePaperClip } from "react-icons/ai";
// import { FaUsers } from "react-icons/fa";
// import { MdOutlineNotInterested } from "react-icons/md";
// import { CiChat1 } from "react-icons/ci";
// import { BiDotsHorizontalRounded } from "react-icons/bi";
import MessageCard from "./MessageCard";
import { useParams } from "react-router-dom";
import { webSocket } from "../socket_init";
import { useEffect, useRef } from "react";
import { Box, Button, Input, TextField } from "@mui/material";
import { store } from "../../../store";
import SearchInput from "../../SearchInput";
import { useChatGetByIdQuery } from "../../../services/chatService";

const ChatField = ({
  messages,
  setMessages,
  setSendMessage,
  sendMessage,
  onRequest,
  setOnRequest,
}) => {
  const { chat_id } = useParams();
  const divRef = useRef();
  const audio = new Audio("/sound/bubbleSound.mp3");
  const authStore = store.getState().auth;

  const { isLoading } = useChatGetByIdQuery({
    id: chat_id,
    queryParams: {
      cacheTime: 10,
      enabled: Boolean(onRequest) || Boolean(chat_id),
      onSuccess: (res) => {
        console.log("res", res);
        setMessages(res.messages);
        setOnRequest(false);
      },
    },
  });
  useEffect(() => {
    // if (sendMessage || messages) {
    if (webSocket) {
      webSocket.onmessage = (event) => {
        console.log("event", event);
        if (messages) {
          audio.play();
          setMessages([...messages, JSON.parse(event.data)]);
        }
      };
    }
    // }
  }, [sendMessage, messages, webSocket]);

  useEffect(() => {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  }, [divRef.current, messages]);

  const handleSendMessage = () => {
    const message = {
      user_id: authStore.userId,
      message: sendMessage || "",
      type: "text",
    };
    if (sendMessage) {
      webSocket.send(JSON.stringify(message));
    }
    setSendMessage("");
  };

  return (
    <Box className={styles.field}>
      <Box className={styles.header}>
        <SearchInput
          className={styles.input}
          placeholder="Поиск по переписке"
          iconColor="#000"
        />
        <Box className={styles.setting}>
          {/* <AiOutlineCheck size={"18px"} />
          <FaUsers size={"20px"} />
          <MdOutlineNotInterested size={"18px"} />
          <CiChat1 size={"18px"} />
          <BiDotsHorizontalRounded size={"18px"} /> */}
        </Box>
      </Box>
      <Box className={styles.chat} ref={divRef}>
        {messages?.map((item, idx) => (
          <MessageCard item={item} idx={idx} />
        ))}
      </Box>
      <Box className={styles.footer}>
        {/* <AiOutlinePaperClip size={"28px"} /> */}
        <TextField
          placeholder="Add a comment"
          onChange={(e) => setSendMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          value={sendMessage}
          fullWidth
        />
        <Button onClick={() => handleSendMessage()}>SEND</Button>
      </Box>
    </Box>
  );
};

export default ChatField;
