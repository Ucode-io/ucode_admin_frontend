import {Box, Menu, Typography} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import sendToGptService from "../../../services/sendToGptService";
import GptChat from "./GptChat";
import UserChat from "./UserChat";
import ChatInput from "./ChatInput";
import { ProjectTypeSelect } from "../../LayoutSidebar/Components/ProjectTypeSelect";
import cls from "./style.module.scss";

const EntityCard = ({ onClick, icon, heading, description, bgcolor }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="12px"
      onClick={onClick}
      padding="12px"
      borderRadius="6px"
      border="1px solid #E2E8F0"
      sx={{ cursor: "pointer" }}
    >
      <Box bgcolor={bgcolor} padding="8px" borderRadius="6px">
        {icon}
      </Box>
      <Box>
        <h3 className={cls.entityHeading}>{heading}</h3>
        <p className={cls.entityDescription}>{description}</p>
      </Box>
    </Box>
  );
};

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
  handleChangeEntityType = () => {},
  selectedEntityType,
  ENTITY_TYPES,
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
                // alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "10px",
                fontSize: "16px",
              }}
            >
              <EntityCard
                onClick={() => handleChangeEntityType(ENTITY_TYPES.TEMPLATES)}
                bgcolor="rgb(229, 240, 255)"
                heading="Templates"
                description="Start fast with pre-built project templates tailored to your needs. Select a project type, then customize features to fit your workflow."
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49M21 5C21 6.65685 19.6569 8 18 8C16.3431 8 15 6.65685 15 5C15 3.34315 16.3431 2 18 2C19.6569 2 21 3.34315 21 5ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 19C21 20.6569 19.6569 22 18 22C16.3431 22 15 20.6569 15 19C15 17.3431 16.3431 16 18 16C19.6569 16 21 17.3431 21 19Z"
                      stroke="rgb(48, 91, 171)"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                }
              />
              <EntityCard
                onClick={() => handleChangeEntityType(ENTITY_TYPES.TABLES)}
                bgcolor="rgb(254, 242, 255)"
                heading="Tables"
                description="Easily create and manage your database tables with a visual editor. Define fields, relationships, and structure—all without code."
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 7.5H17.5M7.5 7.5L7.5 17.5M6.5 2.5H13.5C14.9001 2.5 15.6002 2.5 16.135 2.77248C16.6054 3.01217 16.9878 3.39462 17.2275 3.86502C17.5 4.3998 17.5 5.09987 17.5 6.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5Z"
                      stroke="rgb(200, 81, 195)"
                      stroke-width="1.67"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                }
              />
              <EntityCard
                onClick={() => handleChangeEntityType(ENTITY_TYPES.FUNCTIONS)}
                bgcolor="rgb(239, 237, 253)"
                heading="Functions"
                description="Build powerful Knative serverless functions visually. Automate logic, trigger actions, and extend your project’s backend in minutes."
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.5 15L18.5 12L15.5 9M8.5 9C7.32843 10.1716 5.5 12 5.5 12L8.5 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
                      stroke="rgba(55, 53, 47, 0.85)"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13 7L11 17"
                      stroke="#7C59DF"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  // <svg
                  //   width="24"
                  //   height="24"
                  //   viewBox="0 0 24 24"
                  //   fill="none"
                  //   xmlns="http://www.w3.org/2000/svg"
                  // >
                  //   <path
                  //     d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49M21 5C21 6.65685 19.6569 8 18 8C16.3431 8 15 6.65685 15 5C15 3.34315 16.3431 2 18 2C19.6569 2 21 3.34315 21 5ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 19C21 20.6569 19.6569 22 18 22C16.3431 22 15 20.6569 15 19C15 17.3431 16.3431 16 18 16C19.6569 16 21 17.3431 21 19Z"
                  //     stroke="#7C59DF"
                  //     stroke-width="1.5"
                  //     stroke-linecap="round"
                  //     stroke-linejoin="round"
                  //   />
                  // </svg>
                }
              />
              {/* <img width={30} height={30} src="/img/chat-gpt.png" alt="" />
              <p>
                {showInput
                  ? "How can I help you today...?"
                  : "Please select the type of project"}
              </p> */}
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
          {selectedEntityType !== ENTITY_TYPES.TEMPLATES && (
            <ChatInput
              setLoader={setLoader}
              loader={loader}
              setInputValue={setInputValue}
              handleSendClick={handleSendClick}
              inputValue={inputValue}
              handleKeyDown={handleKeyDown}
            />
          )}
          {selectedEntityType === ENTITY_TYPES.TEMPLATES && (
            <ProjectTypeSelect
              handleClose={handleClose}
              handleError={(error) => handleError(error)}
              handleSuccess={(data) => handleSuccess(data)}
              appendMessage={appendMessage}
              setShowInput={setShowInput}
              handleChangeEntityType={handleChangeEntityType}
            />
          )}
        </Box>
      </Box>
    </Menu>
  );
};

export const useAIChat = () => {
  const ENTITY_TYPES = {
    TEMPLATES: "TEMPLATES",
    MODELS: "MODELS",
    FUNCTIONS: "FUNCTIONS",
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const [selectedEntityType, setSelectedEntityType] = useState(null);

  const handleChangeEntityType = (type) => {
    setSelectedEntityType(type);
  };

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
      ...prevMessages?.filter((item) => !item?.isProjectType),
      { errorText: error?.data, sender: "chat" },
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
    setSelectedEntityType(null);
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
    selectedEntityType,
    handleChangeEntityType,
    ENTITY_TYPES,
  };
};

