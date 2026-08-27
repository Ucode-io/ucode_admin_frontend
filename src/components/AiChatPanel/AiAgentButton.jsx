import { Button } from "@chakra-ui/react";
import { Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { aiChatActions } from "@/store/aiChat/aiChat.slice";
import cls from "./AiAgentButton.module.scss";

/** Bright, AI-styled button that opens the AI chat panel. */
export const AiAgentButton = ({ label = "AI agent", noShadow = false, ...props }) => {
  const dispatch = useDispatch();
  // Право `chat` приходит только когда включено: false бэк режет omitempty.
  // Прав нет вовсе — разрешаем: это «не приехали», а не «нельзя».
  const chatAllowed = useSelector((state) => {
    const rights = state.auth.globalPermissions;
    return !rights || rights.chat === true;
  });

  if (!chatAllowed) return null;

  return (
    <Button
      variant="unstyled"
      className={`${cls.aiBtn} ${noShadow ? cls.noShadow : ""}`}
      onClick={() => dispatch(aiChatActions.openAiChat())}
      {...props}
    >
      <Sparkles size={16} />
      {label ? <span>{label}</span> : null}
    </Button>
  );
};

export default AiAgentButton;
