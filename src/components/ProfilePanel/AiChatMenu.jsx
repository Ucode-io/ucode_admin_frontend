import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  InputAdornment,
  Menu,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, {useState, useEffect, useRef} from "react";
import sendToGptService from "../../services/sendToGptService";

function Loader() {
  return (
    <Typography sx={{fontSize: "16px", fontWeight: "bold"}}>
      Analyzing...
    </Typography>
  );
}

function AiChatMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSendClick = () => {
    setLoader(true);
    const userMessage = inputValue.trim();
    if (userMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {text: userMessage, sender: "user"},
        {type: "loader", sender: "chat"},
      ]);
      setInputValue("");

      sendToGptService
        .sendText({promt: userMessage})
        .then((res) => {
          updateChatMessage(res);
        })
        .catch((err) => {
          console.log("Error:", err?.data?.data);
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            {errorText: err?.data?.data, sender: "chat"},
          ]);
          setLoader(false);
        });
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
      messagesEndRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages]);

  // function animateText(text, speed) {
  //   let index = 0;
  //   let animatedText = "";

  //   function typeNextCharacter() {
  //     if (index < text.length) {
  //       animatedText += text[index];
  //       index++;
  //       setTimeout(typeNextCharacter, speed); // Recursive call with delay
  //     }
  //   }

  //   typeNextCharacter();
  // }

  return (
    <Box
      sx={{
        width: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px",
        padding: "0 5px",
      }}>
      <img width={30} src="/img/ai.png" alt="AI" />
      <Box
        onClick={handleClick}
        sx={{fontSize: "13px", color: "#093979", fontWeight: 900}}>
        AI Chat
      </Box>

      <Menu
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
        transformOrigin={{horizontal: "left", vertical: "bottom"}}
        anchorOrigin={{horizontal: "left", vertical: "top"}}>
        <Box
          sx={{
            height: "600px",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffff",
              color: "#000",
              padding: "10px",
              borderBottom: "1px solid #ccc",
            }}>
            <Typography sx={{marginLeft: "10px"}} variant="h4">
              Chat
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#ffff",
            }}>
            {messages.length > 0 ? (
              messages.map((msg, index) =>
                msg.sender === "user" ? (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      margin: "10px",
                      justifyContent: "flex-end",
                    }}>
                    <Paper
                      sx={{
                        padding: "10px",
                        backgroundColor: "#F4F4F4",
                        alignSelf: "flex-end",
                        maxWidth: "70%",
                        color: "#000",
                        wordBreak: "break-all",
                        borderRadius: "20px",
                        padding: "10px 10px 10px 10px",
                        minHeight: "40px",
                        marginRight: "10px",
                      }}>
                      <Typography sx={{fontSize: "14px", padding: "5px 10px"}}>
                        {msg.text}
                      </Typography>
                    </Paper>
                    <AccountCircleIcon sx={{width: "24px", height: "24px"}} />
                  </Box>
                ) : (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      margin: "10px",
                      justifyContent: "flex-start",
                    }}>
                    <img width={24} height={24} src="/img/chat.png" alt="" />
                    <Paper
                      sx={{
                        padding: "10px",
                        backgroundColor: "#fff",
                        alignSelf: "flex-start",
                        maxWidth: "80%",
                        color: "#000",
                        wordBreak: "break-all",
                        borderRadius: "20px",
                        padding: "10px 15px 10px 10px",
                        minHeight: "40px",
                      }}>
                      {msg.errorText ? (
                        <Typography sx={{fontSize: "14px", color: "red"}}>
                          {msg.errorText}
                        </Typography>
                      ) : msg.type === "loader" ? (
                        <Loader />
                      ) : (
                        <Typography sx={{fontSize: "14px"}}>
                          {msg.text}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
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
                }}>
                <img width={30} height={30} src="/img/chat-gpt.png" alt="" />
                <p>How can I help you today...?</p>
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
            }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
                "& .MuiInputBase-input": {
                  width: "316px",
                  padding: "10px",
                  fontSize: "16px",
                  border: "1px solid #000",
                  overflow: "hidden",
                  borderRadius: "20px",
                  paddingRight: "0px",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                    borderWidth: 0,
                  },
                  "& fieldset": {
                    borderWidth: 0,
                  },
                },
                "& .MuiInputBase-root": {
                  paddingRight: 0,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <button
                      style={{
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        background: "#000",
                      }}
                      onClick={handleSendClick}>
                      <img src="/img/gptSendIcon.svg" alt="" />
                    </button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Menu>
    </Box>
  );
}

export default AiChatMenu;
