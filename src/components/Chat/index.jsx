import { useParams } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatField from "./components/ChatField";
import { useEffect, useState } from "react";
import { connectSocket } from "./socket_init";
import { useChatListQuery } from "../../services/chatService";
import { Box } from "@mui/material";
import { store } from "../../store";
import RouterTabsBlock from "../../layouts/MainLayout/RouterTabsBlock";

const Chat = () => {
  const authStore = store.getState().auth;
  const { chat_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState("");
  const [onRequest, setOnRequest] = useState(false);
  const { data: chats, isLoading } = useChatListQuery({
    params: {
      "project-id": authStore.projectId,
    },
  });

  useEffect(() => {
    if (chat_id) {
      connectSocket(sendMessage, chat_id);
    }
  }, [chat_id]);

  return (
    <>
      <RouterTabsBlock />
      <Box display={"flex"} height="100%" width={"100%"}>
        <ChatSidebar chats={chats} setOnRequest={setOnRequest} />
        <ChatField
          setMessages={setMessages}
          messages={messages}
          setSendMessage={setSendMessage}
          sendMessage={sendMessage}
          onRequest={onRequest}
          setOnRequest={setOnRequest}
        />
      </Box>
    </>
  );
};

export default Chat;
