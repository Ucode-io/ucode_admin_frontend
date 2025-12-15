import { PromptInput } from "./components/PromptInput";
import cls from "./styles.module.scss";

export const AiAgent = () => {

  return <div className={cls.aiAgent}>
    <div className={cls.gradient} />
    <div className={cls.promptInputWrapper}>
      <PromptInput />
    </div>
  </div>;
};
