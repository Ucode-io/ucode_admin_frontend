import { Header } from "./components/Header";
import { useAiResultProps } from "./useAiResultProps";

import cls from "./styles.module.scss";
import { AiChat } from "../../components/AiChat";

export const AiResult = ({
  files,
  env,
  handleUpdateCode,
  generatedUiRef,
  onSubmit,
  prompt,
  setPrompt,
  chatVisible,
  setChatVisible,
}) => {
  const { activeTab, tabs, tabContent, handleChangeTab } = useAiResultProps({
    files,
    env,
    handleUpdateCode,
    generatedUiRef,
    chatVisible,
    setChatVisible,
  });

  return (
    <div className={cls.aiResult}>
      <Header tabs={tabs} activeTab={activeTab} onChange={handleChangeTab} />
      <div className={cls.body}>
        <div className={cls.content}>{tabContent[activeTab]}</div>
        <AiChat
          visible={chatVisible}
          setVisible={setChatVisible}
          generatedUiRef={generatedUiRef}
          onSubmit={onSubmit}
          value={prompt}
          setValue={setPrompt}
          files={files}
        />
      </div>
    </div>
  );
};
