import cls from "./styles.module.scss";
import { useAiAgentProps } from "./useAiAgentProps";
import { AiResult } from "./modules/AiResult";
import { PromptContainer } from "./components/PromptContainer";
import { MoveablePromptInput } from "./components/MoveablePromptInput";
import clsx from "clsx";

export const AiAgent = () => {
  const { generatedUiRef, isLoading, files, onSubmit, prompt, setPrompt, env } =
    useAiAgentProps();

  const hasProject = Object.keys(files).length > 0;

  return (
    <div className={clsx(cls.aiAgent, { [cls.withProject]: hasProject })}>
      {!hasProject && <div className={cls.gradient} />}
      <div className={cls.container}>
        {hasProject ? (
          <MoveablePromptInput
            value={prompt}
            setValue={setPrompt}
            generatedUiRef={generatedUiRef}
            onSubmit={onSubmit}
          />
        ) : (
          <PromptContainer
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        )}
        {/* <AiChat
          visible={isChatVisible}
          messages={messages}
          setMessages={setMessages}
          generatedUiRef={generatedUiRef}
          handleFullScreen={handleFullScreen}
        /> */}
        {hasProject && (
          <AiResult generatedUiRef={generatedUiRef} files={files} env={env} />
        )}
      </div>
    </div>
  );
};
