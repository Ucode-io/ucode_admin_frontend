import clsx from "clsx";
import cls from "./styles.module.scss";
import { usePromptContainer } from "./usePromptContainer";
import { PromptInput } from "../PromptInput";

export const PromptContainer = ({prompt, setPrompt, sendPrompt = () => {}}) => {

  const {
    recommendedPrompts,
    inputRef,
  } = usePromptContainer();

  return  <div className={cls.promptContainer}>
    <div
      className={clsx(cls.promptInputWrapper)}
    >
      <div className={cls.recommendedPrompts}>
        {recommendedPrompts.map((rec, index) => (
          <div
            className={cls.recommendedPrompt}
            onClick={() => {
              setPrompt(rec);
              inputRef.current.focus();
            }}
            key={index}
          >
            {rec}
          </div>
        ))}
      </div>
      <div className={cls.promptInput}>
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={sendPrompt}
          ref={inputRef}
        />
      </div>
    </div>
  </div>
}