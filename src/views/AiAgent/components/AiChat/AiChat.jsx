import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAiChatProps } from "./useAiChatProps"
import { Message } from "../Message";

import cls from "./styles.module.scss";
import clsx from 'clsx';

export const AiChat = ({ 
  messages = [],
  setMessages = () => {},
  setPrompt = () => {},
  sendPrompt = () => {},
  prompt,
  generatedUiRef,
  visible,
}) => {

  const {
    handleSend,
    handleInspect,
    chatBodyRef,
    textAreaRef,
    onBackClick,
    isEmpty,
    handleInput,
    handleKeyDown,
    isInspectEnabled,
    handleMouseMove,
    handleMouseLeave,
  } = useAiChatProps({ 
    setMessages,
    messages,
    setPrompt,
    sendPrompt,
    prompt,
    generatedUiRef,
  });

  return <div className={clsx(cls.aiChat, {[cls.visible]: visible})}>
    <div className={cls.aiChatHeader}>
      <button className={cls.backButton} onClick={onBackClick}>
        <ArrowBackIcon width="32px" height="32px" />
      </button>
      <button className={clsx(cls.inspectButton, {[cls.active]: isInspectEnabled})} onClick={handleInspect}>
        <span className={cls.inspectIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" x="0" y="0" viewBox="0 0 64 64"  xmlSpace="preserve" className=""><g><path fill="currentColor" d="M37 62 24 22l38 13-17 8z" opacity="1" data-original="#f4b2b0" className=""></path><g fill="#b3404a"><path d="m62.323 34.054-38-13a1 1 0 0 0-1.274 1.255l13 40a1 1 0 0 0 .909.689H37a1 1 0 0 0 .922-.612l7.85-18.647 16.654-7.836a1 1 0 0 0-.1-1.851zm-25.2 25.083L26.238 25.653l17.579 17.579zM45.21 41.8 27.756 24.342l31.584 10.8zM25 37h2v2h-2zM21 37h2v2h-2zM17 37h2v2h-2zM13 37h2v2h-2zM9 37h2v2H9zM5 37h2v2H5zM21 1h2v2h-2zM17 1h2v2h-2zM13 1h2v2h-2zM33 1h2v2h-2zM37 1h2v2h-2zM29 1h2v2h-2zM25 1h2v2h-2zM9 1h2v2H9zM5 1h2v2H5zM1 37h2v2H1zM1 33h2v2H1zM1 29h2v2H1zM1 25h2v2H1zM1 21h2v2H1zM1 17h2v2H1zM1 13h2v2H1zM1 9h2v2H1zM1 5h2v2H1zM37 21h2v2h-2zM37 17h2v2h-2zM37 13h2v2h-2zM37 9h2v2h-2zM37 5h2v2h-2zM1 1h2v2H1z" fill="#9dcdef" opacity="1" data-original="#b3404a" className=""></path></g></g></svg>
        </span>
      </button>
    </div>
    <div className={cls.aiChatBody} ref={chatBodyRef}>
      <div className={cls.messages}>
        {
          messages.map((message, index) => (
            <Message key={index} from={message?.from} text={message?.text} />
          ))
        }
      </div>
    </div>
    <div className={cls.aiChatFooter}>
      <form className={cls.promptInputWrapper} onSubmit={handleSend}>
        <div
          className={cls.textArea}
          ref={textAreaRef}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          contentEditable
          suppressContentEditableWarning
        >
          {
            isEmpty && 
            <span className={cls.textAreaPlaceholder}>Ask AI to change something...</span>
          }
        </div>
        <button
          className={cls.sendButton} 
          type="submit"
        >
          <span className={cls.sendIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" x="0" y="0" viewBox="0 0 24 24" fillRule="evenodd"><g><path d="M11.162 12.838 2.114 9.822a1.264 1.264 0 0 1 .012-2.401l18.973-6.11a1.265 1.265 0 0 1 1.59 1.59l-6.11 18.973a1.263 1.263 0 0 1-2.401.012zM3.273 8.627l8.719 2.907c.224.074.4.25.474.474l2.907 8.719L21.12 2.88z" fill="#ffffff" opacity="1" data-original="#000000" ></path><path d="M12.285 12.775a.749.749 0 1 1-1.06-1.06l9.801-9.801a.749.749 0 1 1 1.06 1.06z" fill="#ffffff" opacity="1" data-original="#000000"></path></g></svg>
          </span>
        </button>
      </form>
    </div>
  </div>
}
