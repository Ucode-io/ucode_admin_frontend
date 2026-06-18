import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { BuildTimeline } from "./BuildTimeline";
import cls from "../styles.module.scss";

/** Scrollable thread: persisted messages + the in-flight assistant run. */
export const Conversation = ({ messages, run }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, run]);

  return (
    <div className={cls.conversation}>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {/* Live assistant turn while streaming. */}
      {run && (
        <div className={cls.assistantMsg}>
          <BuildTimeline run={run} />
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
};

export default Conversation;
