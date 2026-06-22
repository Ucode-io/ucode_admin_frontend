import { Button } from "@chakra-ui/react";
import { Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { aiChatActions } from "@/store/aiChat/aiChat.slice";
import cls from "./AiAgentButton.module.scss";

/** Bright, AI-styled button that opens the AI chat panel. */
export const AiAgentButton = ({ label = "AI agent", noShadow = false, ...props }) => {
  const dispatch = useDispatch();

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
