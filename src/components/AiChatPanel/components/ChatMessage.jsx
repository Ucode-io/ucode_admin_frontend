import { Sparkles } from "lucide-react";
import { BuildTimeline } from "./BuildTimeline";
import cls from "../styles.module.scss";

/**
 * One turn in the thread.
 * - user: a right-aligned bubble.
 * - assistant: the build timeline (status, separate block) followed by the reply
 *   in its own bubble. `liveRun` is passed while streaming; persisted messages
 *   carry the data inline.
 */
export const ChatMessage = ({ message, liveRun }) => {
  if (message.role === "user") {
    return (
      <div className={cls.userMsg}>
        <div className={cls.userBubble}>{message.content}</div>
      </div>
    );
  }

  const run = liveRun || message;

  return (
    <div className={cls.assistantMsg}>
      <BuildTimeline run={run} />
      {message.content ? (
        <div className={cls.assistantBubble}>
          <Sparkles size={15} className={cls.assistantBubbleIcon} />
          <div className={cls.assistantBubbleText}>{message.content}</div>
        </div>
      ) : null}
    </div>
  );
};

export default ChatMessage;
