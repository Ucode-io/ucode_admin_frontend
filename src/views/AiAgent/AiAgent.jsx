import { useRef, useState } from "react";
import { PromptInput } from "./components/PromptInput";
import AiUiPreview from "../AiUiPreview/AiUiPreview";
import cls from "./styles.module.scss";
import { useUiSpecFromAi } from "@/hooks/useUiSpecFromAi";
import AssistantOutlined from "@mui/icons-material/AssistantOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import clsx from "clsx";

export const AiAgent = () => {
  const inputRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [showInput, setShowInput] = useState(true);

  const recommendedPrompts = [
    "Create a modern dashboard design",
    "Generate a landing page for SaaS",
    "Design a mobile app interface",
    "Build an e-commerce product card",
  ];

  const { status, uiSpec, error, run } = useUiSpecFromAi({
    endpoint: "https://admin-api.ucode.run/v1/ai/ui",
    payload: {
      prompt,
      // если нужно — добавь management_system / project_type
    },
  });

  const onSubmit = () => {
    run();
  };

  if (status === "loading")
    return <div style={{ padding: 16 }}>Loading...</div>;
  if (status === "error")
    return <div style={{ padding: 16 }}>Error: {error}</div>;

  return (
    <div className={cls.aiAgent}>
      <div className={cls.gradient} />
      <div className={cls.promptContainer}>
        <div
          className={clsx(cls.promptInputWrapper, {
            [cls.show]: showInput,
          })}
        >
          {showInput && (
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
          )}
          <div className={cls.promptInput}>
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={onSubmit}
              ref={inputRef}
            />
            <button
              className={clsx(cls.inputToggler, {
                [cls.active]: showInput,
              })}
              onClick={() => {
                setShowInput(!showInput);
                if (!showInput) {
                  inputRef.current.focus();
                }
              }}
            >
              {showInput ? (
                <ArrowDropDownOutlinedIcon fontSize="12px" />
              ) : (
                <AssistantOutlined />
              )}
            </button>
          </div>
        </div>
      </div>
      {status === "ready" && <AiUiPreview uiSpec={uiSpec} />}
    </div>
  );
};
