import clsx from "clsx";
import cls from "./styles.module.scss";
import { usePromptContainer } from "./usePromptContainer";
import { PromptInput } from "../PromptInput";

export const PromptContainer = ({
  prompt,
  setPrompt,
  onSubmit = () => {},
  isLoading,
}) => {
  const { recommendedPrompts, inputRef } = usePromptContainer();

  return (
    <div className={clsx(cls.promptContainer)}>
      <div className={clsx(cls.promptInputWrapper)}>
        <div className={cls.recommendedPrompts}>
          {recommendedPrompts.map((rec, index) => (
            <div
              className={clsx(cls.recommendedPrompt, {
                [cls.loading]: isLoading,
              })}
              onClick={() => {
                if (isLoading) return;
                setPrompt(rec.prompt);
                inputRef.current.focus();
              }}
              key={index}
            >
              {rec.title}
            </div>
          ))}
        </div>
        <div className={cls.promptInput}>
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={onSubmit}
            ref={inputRef}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};