import { Header } from "./components/Header";
import { useAiResultProps } from "./useAiResultProps";

import cls from "./styles.module.scss";
import { GeneratingOverlay } from "../../components/GeneratingOverlay";

export const AiResult = ({ generatedUiRef, files, env, handleUpdateCode }) => {
  const {
    activeTab,
    tabs,
    tabContent,
    handleChangeTab,
    runCode,
    loading,
  } = useAiResultProps({ generatedUiRef, files, env, handleUpdateCode });

  return (
    <div className={cls.aiResult}>
      <Header
        tabs={tabs}
        activeTab={activeTab}
        handleRunCode={runCode}
        onChange={handleChangeTab}
      />
        <div className={cls.content}>{tabContent[activeTab]}</div>
    </div>
  );
};
