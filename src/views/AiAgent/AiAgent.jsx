import AiUiPreview from "../AiUiPreview/AiUiPreview";
import cls from "./styles.module.scss";
import { useAiAgentProps } from "./useAiAgentProps";
import { PromptContainer } from "./components/PromptContainer";
import { GeneratedUi } from "./modules/GeneratedUi";
import { AiChat } from "./components/AiChat";
import clsx from "clsx";
import { FullScreenButton } from "./components/FullScreenButton";

export const AiAgent = () => {
  const {
    status,
    uiSpec,
    handleFullScreen,
    prompt,
    setPrompt,
    hasChatHistory,
    messages,
    setMessages,
    sendPrompt,
    generatedUiRef,
    isChatVisible,
  } = useAiAgentProps();

  if (status === "loading")
    return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div className={cls.aiAgent}>
      <FullScreenButton
        className={cls.fullScreenBtn}
        onClick={handleFullScreen}
        opened={!isChatVisible}
      />
      <div className={cls.gradient} />
      <div
        className={clsx(cls.container, [hasChatHistory && cls.hasChatHistory])}
      >
        {hasChatHistory ? (
          <AiChat
            visible={isChatVisible}
            messages={messages}
            setMessages={setMessages}
            prompt={prompt}
            setPrompt={setPrompt}
            sendPrompt={sendPrompt}
            generatedUiRef={generatedUiRef}
          />
        ) : (
          <PromptContainer
            prompt={prompt}
            setPrompt={setPrompt}
            sendPrompt={sendPrompt}
          />
        )}
        <GeneratedUi className={cls.generatedUi} ref={generatedUiRef} />
      </div>
      {status === "ready" && <AiUiPreview uiSpec={uiSpec} />}
    </div>
  );
};
