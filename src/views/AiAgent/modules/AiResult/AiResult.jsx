import { Header } from "./components/Header";
import { useAiResultProps } from "./useAiResultProps";

import cls from "./styles.module.scss";

export const AiResult = ({ files, env, handleUpdateCode, generatedUiRef }) => {
  const { activeTab, tabs, tabContent, handleChangeTab } = useAiResultProps({
    files,
    env,
    handleUpdateCode,
    generatedUiRef,
  });

  return (
    <div className={cls.aiResult}>
      <Header tabs={tabs} activeTab={activeTab} onChange={handleChangeTab} />
      <div className={cls.content}>{tabContent[activeTab]}</div>
    </div>
  );
};
