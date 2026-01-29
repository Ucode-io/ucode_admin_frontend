import cls from "./styles.module.scss";
import { useAiAgentProps } from "./useAiAgentProps";
import { AiResult } from "./modules/AiResult";
import { PromptContainer } from "./components/PromptContainer";
import { MoveablePromptInput } from "./components/MoveablePromptInput";
import { GeneratingOverlay } from "./components/GeneratingOverlay";
import clsx from "clsx";

export const AiAgent = () => {
  const {
    generatedUiRef,
    isLoading,
    files,
    onSubmit,
    prompt,
    setPrompt,
    env,
    handleUpdateCode,
    hasProject,
    chatVisible,
    setChatVisible,
  } = useAiAgentProps();

  return (
    <div className={clsx(cls.aiAgent, { [cls.withProject]: hasProject })}>
      {!hasProject && <div className={cls.gradient} />}
      {isLoading && <GeneratingOverlay open={true} prompt={prompt} />}
      <div className={cls.container}>
        {hasProject ? (
          !chatVisible ? (
            <MoveablePromptInput
              value={prompt}
              setValue={setPrompt}
              generatedUiRef={generatedUiRef}
              onSubmit={onSubmit}
              files={files}
            />
          ) : null
        ) : (
          <PromptContainer
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        )}
        {hasProject && (
          <AiResult
            files={files}
            env={env}
            handleUpdateCode={handleUpdateCode}
            generatedUiRef={generatedUiRef}
            onSubmit={onSubmit}
            prompt={prompt}
            setPrompt={setPrompt}
            chatVisible={chatVisible}
            setChatVisible={setChatVisible}
          />
        )}
      </div>
    </div>
  );
};
