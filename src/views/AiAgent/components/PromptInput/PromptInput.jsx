import { forwardRef, useEffect, useState } from "react";
import cls from "./styles.module.scss";
import { AiIcon } from "@/mock/icons";
import clsx from "clsx";

const useGetDots = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return dots;
};

export const PromptInput = forwardRef(
  ({ setPrompt, prompt = "", onSubmit, isLoading }, ref) => {
    const dots = useGetDots();

    return (
      <div
        className={clsx(cls.promptInputWrapper, { [cls.loading]: isLoading })}
      >
        <div className={cls.promptInput}>
          <textarea
            value={isLoading ? `Generating your project${dots}` : prompt}
            onChange={(e) => setPrompt(e.target.value)}
            ref={ref}
            className={cls.textArea}
            placeholder="Describe what you want to generate..."
            disabled={isLoading}
          />
          <button
            className={cls.submitButton}
            type="button"
            onClick={onSubmit}
            disabled={!prompt.trim() || isLoading}
          >
            <AiIcon />
          </button>
        </div>
      </div>
    );
  },
);

PromptInput.displayName = "PromptInput";
