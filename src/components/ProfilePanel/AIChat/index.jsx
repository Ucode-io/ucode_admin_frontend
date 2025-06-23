import {Box, Menu, Typography} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import sendToGptService from "../../../services/sendToGptService";
import GptChat from "./GptChat";
import UserChat from "./UserChat";
import ChatInput from "./ChatInput";
import { ProjectTypeSelect } from "../../LayoutSidebar/Components/ProjectTypeSelect";

export const AIMenu = ({
  open,
  anchorEl,
  loader,
  setLoader,
  inputValue,
  setInputValue,
  messages,
  messagesEndRef,
  handleClose,
  handleKeyDown,
  handleSendClick,
  showInput,
  setShowInput,
  handleSuccess = () => {},
  handleError = () => {},
  onExited = () => {},
  appendMessage = () => {},
}) => {
  return (
    <Menu
      TransitionProps={{
        onExited,
      }}
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          padding: 0,
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 52,
            height: 32,
            ml: -0.5,
            mr: 1,
            bottom: 4,
          },
        },
      }}
      transformOrigin={{ horizontal: "left", vertical: "bottom" }}
      anchorOrigin={{ horizontal: "left", vertical: "top" }}
    >
      <Box
        sx={{
          height: "600px",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffff",
            color: "#000",
            padding: "10px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Typography sx={{ marginLeft: "10px" }} variant="h4">
            Chat
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            padding: "10px",
            overflowY: "auto",
            backgroundColor: "#ffff",
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) =>
              msg.sender === "user" ? (
                <UserChat index={index} msg={msg} />
              ) : (
                <GptChat index={index} msg={msg} />
              )
            )
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "15px",
                fontSize: "16px",
              }}
            >
              <img width={30} height={30} src="/img/chat-gpt.png" alt="" />
              <p>
                {showInput
                  ? "How can I help you today...?"
                  : "Please select the type of project"}
              </p>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            borderTop: "1px solid #ccc",
            backgroundColor: "#fff",
          }}
        >
          {showInput ? (
            <ChatInput
              setLoader={setLoader}
              loader={loader}
              setInputValue={setInputValue}
              handleSendClick={handleSendClick}
              inputValue={inputValue}
              handleKeyDown={handleKeyDown}
            />
          ) : (
            <ProjectTypeSelect
              handleClose={handleClose}
              handleError={(error) => handleError(error)}
              handleSuccess={(data) => handleSuccess(data)}
              appendMessage={appendMessage}
              setShowInput={setShowInput}
            />
          )}
        </Box>
      </Box>
    </Menu>
  );
};

export const useAIChat = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSuccess = (data) => {
    setMessages((prevMessages) => {
      return [
        ...prevMessages?.filter((item) => !item?.isProjectType),
        { text: data, sender: "chat" },
      ];
    });
  };

  const handleError = (error) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { errorText: error, sender: "chat" },
    ]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onExited = () => {
    setShowInput(false);
    setMessages([]);
    setInputValue("");
    setLoader(false);
  };

  const handleSendClick = () => {
    setLoader(true);
    const userMessage = inputValue.trim();

    if (userMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userMessage, sender: "user" },
        { type: "loader", sender: "chat" },
      ]);
      setInputValue("");
      sendToGptService
        .sendText({ promt: userMessage })
        .then((res) => {
          updateChatMessage(res);
          setInputValue("");
        })
        .catch((err) => {
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { errorText: err?.data?.data, sender: "chat" },
          ]);
          setLoader(false);
        });
    }
  };

  const appendMessage = (message) => {
    if (Array.isArray(message)) {
      setMessages((prev) => [...prev, ...message]);
      return;
    } else {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  const updateChatMessage = (chatMessage) => {
    const typingSpeed = 50;
    let index = 0;
    setLoader(false);

    const chatText = chatMessage.trim();

    const typingInterval = setInterval(() => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];

        const lastMessageIndex = newMessages.length - 1;

        if (newMessages[lastMessageIndex].type === "loader") {
          newMessages[lastMessageIndex].type = "chat";
          newMessages[lastMessageIndex].text = chatText;
        }

        return newMessages;
      });

      index++;

      if (index >= chatText.length) {
        clearInterval(typingInterval);
      }
    }, typingSpeed);
  };

  const handleKeyDown = (event) => {
    if (event.key === "c" || event.key === "C") {
      event.stopPropagation();
    }
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [inputValue]);

  return {
    open,
    anchorEl,
    loader,
    setLoader,
    inputValue,
    setInputValue,
    messages,
    messagesEndRef,
    handleClick,
    handleClose,
    handleKeyDown,
    handleSendClick,
    setAnchorEl,
    showInput,
    setShowInput,
    handleSuccess,
    handleError,
    onExited,
    appendMessage,
  };
};

