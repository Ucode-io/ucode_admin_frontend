import ChatSidebar from "./ChatSidebar";
import ChatField from "./components/ChatField";
import { useState } from "react";
import { useChatListQuery } from "../../services/chatService";
import { Box } from "@mui/material";
import { store } from "../../store";
import RouterTabsBlock from "../../layouts/MainLayout/RouterTabsBlock";

const Chat = () => {
  const authStore = store.getState().auth;
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [onRequest, setOnRequest] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { isLoading } = useChatListQuery({
    params: {
      "project-id": authStore.projectId,
      search: searchText,
    },
    queryParams: {
      // enabled: !!searchText,
      onSuccess: (res) => {
        setChats(res.chats);
      },
    },
  });

  return (
    <>
      <RouterTabsBlock />
      <Box display={"flex"} height="100%" width={"100%"}>
        <ChatSidebar
          chats={chats}
          setChats={setChats}
          setOnRequest={setOnRequest}
          setSearchText={setSearchText}
        />
        <ChatField
          setMessages={setMessages}
          messages={messages}
          onRequest={onRequest}
          setOnRequest={setOnRequest}
        />
      </Box>
    </>
  );
};

export default Chat;
