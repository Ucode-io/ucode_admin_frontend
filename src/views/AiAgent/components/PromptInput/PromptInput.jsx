import cls from "./styles.module.scss";
import { usePromptInputProps } from "./usePromptInputProps";

export const PromptInput = () => {

  const {
    prompt,
    inputRef,
    setPrompt,
    handleSubmit,
    recommendedPrompts,
  } = usePromptInputProps();

  return <div className={cls.promptInputWrapper}>
    <div className={cls.recommendedPrompts}>
    {recommendedPrompts.map((rec, index) => (
      <div
        className={cls.recommendedPrompt}
        onClick={() => {
          setPrompt(rec);
          inputRef.current.focus()
        }}
        key={index}
      >
        {rec}
      </div>
    ))}
    </div>
    <div className={cls.promptInput}>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        ref={inputRef}
        className={cls.textArea}
        placeholder="Describe what you want to generate..."
      />
      <button
        className={cls.submitButton}
        type="button"
        onClick={handleSubmit}
        disabled={!prompt.trim()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles h-5 w-5" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>
    </button>
    </div>
    {/* <div className={cls.promptInputFooter}>
      <button className={cls.promptInputBtn}>
        <span>Send</span>
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="m4.497 20.835l16.51-7.363c1.324-.59 1.324-2.354 0-2.944L4.497 3.164c-1.495-.667-3.047.814-2.306 2.202l3.152 5.904c.245.459.245 1 0 1.458l-3.152 5.904c-.74 1.388.81 2.87 2.306 2.202"></path></svg>
      </button>
    </div> */}
  </div>;
};
