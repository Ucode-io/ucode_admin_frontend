import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate } from "react-router-dom";
import RectangleIconButton from "../../Buttons/RectangleIconButton";
const ChatRouter = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chat");
  };

  return (
    <div>
      <RectangleIconButton color="primary" onClick={handleClick}>
        <ChatBubbleOutlineIcon color="primary" />
      </RectangleIconButton>
    </div>
  );
};
export default ChatRouter;
