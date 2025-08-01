import { Box, Paper } from "@mui/material";

export const ChatBox = ({children}) => {

  return <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      margin: "10px",
      justifyContent: "flex-start",
      gap: "12px",
    }}
  >
    <img width={24} height={24} src="/img/chat.png" alt="" />
    <Paper
      sx={{
        backgroundColor: "#fff",
        alignSelf: "flex-start",
        maxWidth: "80%",
        color: "#000",
        wordBreak: "break-all",
        border: "1px solid #E0E2E8",
        minHeight: "40px",
        flexGrow: 1,
        padding: "10px"
      }}
    >
      {children}
    </Paper>
  </Box>
}