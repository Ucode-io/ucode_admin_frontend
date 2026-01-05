import { Header } from "./components/Header";
import { useAiResultProps } from "./useAiResultProps";

import cls from "./styles.module.scss";

export const AiResult = ({generatedUiRef}) => {
  const {
    activeTab,
    tabs,
    tabContent,
    handleChangeTab,
  } = useAiResultProps({ generatedUiRef });

  return (
    <div className={cls.aiResult}>
      <Header tabs={tabs} activeTab={activeTab} handleRunCode={() => { }} onChange={handleChangeTab} />
      <div className={cls.content}>
        {tabContent[activeTab]}
      </div>
    </div>
  );
};
