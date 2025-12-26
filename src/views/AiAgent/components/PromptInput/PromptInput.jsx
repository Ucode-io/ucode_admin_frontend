import { forwardRef } from "react";
import cls from "./styles.module.scss";
import { AiIcon } from "@/mock/icons";

export const PromptInput = forwardRef(
  ({ setPrompt, prompt = "", onSubmit }, ref) => {
    return (
      <div className={cls.promptInputWrapper}>
        <div className={cls.promptInput}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            ref={ref}
            className={cls.textArea}
            placeholder="Describe what you want to generate..."
          />
          <button
            className={cls.submitButton}
            type="button"
            onClick={onSubmit}
            disabled={!prompt.trim()}
          >
            <AiIcon />
          </button>
        </div>
      </div>
    );
  },
);

PromptInput.displayName = "PromptInput";
