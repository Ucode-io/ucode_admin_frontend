import { Header } from "./components/Header";
import { useAiResultProps } from "./useAiResultProps";

import cls from "./styles.module.scss";

export const AiResult = ({ generatedUiRef, files, env }) => {
  const { activeTab, tabs, tabContent, handleChangeTab, runCode, loading } =
    useAiResultProps({ generatedUiRef, files, env });

  return (
    <div className={cls.aiResult}>
      <Header
        tabs={tabs}
        activeTab={activeTab}
        handleRunCode={runCode}
        onChange={handleChangeTab}
      />

      {loading ? (
        "Loading..."
      ) : (
        <div className={cls.content}>{tabContent[activeTab]}</div>
      )}
    </div>
  );
};
