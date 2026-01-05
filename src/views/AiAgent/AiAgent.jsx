import cls from "./styles.module.scss";
import { useAiAgentProps } from "./useAiAgentProps";
import { AiResult } from "./modules/AiResult";
import { AiChat } from "./components/AiChat";

export const AiAgent = () => {
  const { messages, setMessages, generatedUiRef, isChatVisible, isLoading } =
    useAiAgentProps();

  if (isLoading === "loading")
    return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div className={cls.aiAgent}>
      <div className={cls.gradient} />
      <div className={cls.container}>
        <AiChat
          visible={isChatVisible}
          messages={messages}
          setMessages={setMessages}
          generatedUiRef={generatedUiRef}
        />
        <AiResult generatedUiRef={generatedUiRef} />
      </div>
    </div>
  );
};
