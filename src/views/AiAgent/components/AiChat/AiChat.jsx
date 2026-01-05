import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAiChatProps } from "./useAiChatProps"
import { Message } from "../Message";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import SendIcon from "@mui/icons-material/Send";

import cls from "./styles.module.scss";
import clsx from "clsx";

export const AiChat = ({
  messages = [],
  setMessages = () => {},
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
    handleClick,
  } = useAiChatProps({ setMessages, messages, generatedUiRef });

  return (
    <div className={clsx(cls.aiChat, { [cls.visible]: visible })}>
      <div className={cls.aiChatHeader}>
        <button className={cls.backButton} onClick={onBackClick}>
          <ArrowBackIcon width="32px" height="32px" />
        </button>
      </div>
      <div className={cls.aiChatBody} ref={chatBodyRef}>
        <div className={cls.messages}>
          {messages.map((message, index) => (
            <Message key={index} from={message?.from} text={message?.text} />
          ))}
        </div>
      </div>
      <div className={cls.aiChatFooter}>
        <form className={cls.promptInputWrapper} onSubmit={handleSend}>
          {isEmpty && (
            <span className={cls.textAreaPlaceholder}>
              Ask AI to change something...
            </span>
          )}
          <div
            className={cls.textArea}
            ref={textAreaRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            contentEditable
            suppressContentEditableWarning
          />
          <div className={cls.aiChatFooterBottom}>
            <button
              className={clsx(cls.inspectButton, {
                [cls.active]: isInspectEnabled,
              })}
              type="button"
              onClick={handleInspect}
            >
              <HighlightAltIcon />
            </button>
            <button className={cls.sendButton} type="submit">
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
