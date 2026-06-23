import cls from "./styles.module.scss";
import { useAiAgentProps } from "./useAiAgentProps";
import { AiResult } from "./modules/AiResult";
import { MoveablePromptInput } from "./components/MoveablePromptInput";
import { GeneratingOverlay } from "./components/GeneratingOverlay";
import HomePage from "./modules/HomePage/HomePage";
import clsx from "clsx";

import PlanEditor from "./modules/PlanEditor/PlanEditor";

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
    plan,
    setPlan,
    generateProjectWithPlan,
    isPlanning,
  } = useAiAgentProps();

  const hasPlan = plan && (plan.frontend_plan || plan.backend_plan);

  return (
    <div className={clsx(cls.aiAgent, { [cls.withProject]: hasProject })}>
      {!hasProject && !hasPlan && <div className={cls.gradient} />}
      {isLoading && (
        <GeneratingOverlay open={true} prompt={prompt} planning={isPlanning} />
      )}
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
        ) : hasPlan ? (
          <PlanEditor
            plan={plan}
            setPlan={setPlan}
            onSubmit={generateProjectWithPlan}
          />
        ) : (
          <HomePage setPrompt={setPrompt} prompt={prompt} onSubmit={onSubmit} />
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
