import cls from "./styles.module.scss";
import { useAiAgentProps } from "./useAiAgentProps";
import { AiResult } from "./modules/AiResult";
import { PromptContainer } from "./components/PromptContainer";
import { MoveablePromptInput } from "./components/MoveablePromptInput";
import clsx from "clsx";
import { GeneratingOverlay } from "./components/GeneratingOverlay";

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
  } = useAiAgentProps();

  return (
    <div className={clsx(cls.aiAgent, { [cls.withProject]: hasProject })}>
      {!hasProject && <div className={cls.gradient} />}
      {isLoading && <GeneratingOverlay open={true} prompt={prompt} />}
      <div className={cls.container}>
        {hasProject ? (
          <MoveablePromptInput
            value={prompt}
            setValue={setPrompt}
            generatedUiRef={generatedUiRef}
            onSubmit={onSubmit}
            files={files}
          />
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
          />
        )}
      </div>
    </div>
  );
};
