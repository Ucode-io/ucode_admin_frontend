import { useAiChatProps } from "./useAiChatProps";
import { Message } from "../Message";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import SendIcon from "@mui/icons-material/Send";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import cls from "./styles.module.scss";
import clsx from "clsx";
import { useInspect } from "@/hooks/useInspect";
import { useFileUpload } from "@/hooks/useFileUpload";

export const AiChat = ({
  generatedUiRef,
  visible,
  setVisible = () => {},
  onSubmit = () => {},
  value,
  setValue,
  files = [],
}) => {
  const {
    messages,
    chatBodyRef,
    isInspectEnabled,
    enableInspect,
    disableInspect,
    handleSend,
  } = useAiChatProps({ generatedUiRef });

  const { selectedContexts, handleRemoveContext, setSelectedContexts } = useInspect({ files });

  const {
    fileInputRef,
    images = [],
    handlePickClick,
    onFileUpload,
    dragDropProps,
    onPaste,
    removeImage,
    isDragging,
    setImages,
  } = useFileUpload();

  return (
    <div
      className={clsx(cls.aiChat, {
        [cls.visible]: visible,
        [cls.dragging]: isDragging,
      })}
      {...dragDropProps}
      onPaste={onPaste}
    >
      <div className={cls.aiChatHeader}>
        <span
          className={clsx(cls.aiChatToggler, { [cls.closed]: !visible })}
          onClick={() => setVisible(!visible)}
        >
          <span className={cls.icon}>
            <PlayArrowIcon fontSize="14px" />
          </span>
        </span>
      </div>
      <div className={cls.aiChatBody} ref={chatBodyRef}>
        <div className={cls.messages}>
          {messages.map((message, index) => (
            <Message key={index} from={message?.from} text={message?.text} />
          ))}
        </div>
      </div>
      <div className={cls.aiChatFooter}>
        <form
          className={cls.promptInputWrapper}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              context: selectedContexts,
              images: images?.map((img) => img.url),
            });
            handleSend(value);
            setImages([]);
            setSelectedContexts([]);
          }}
        >
          {selectedContexts.length > 0 && (
            <div className={cls.contexts}>
              {selectedContexts?.map((item, index) => (
                <span className={cls.badge} key={index}>
                  {"<" + item.tag?.toLowerCase() + "/>"}
                  <button
                    className={cls.badgeClearBtn}
                    onClick={() => handleRemoveContext(index)}
                    type="button"
                  />
                </span>
              ))}
            </div>
          )}
          {images?.length > 0 && (
            <div className={cls.images}>
              {images.map((img) => (
                <div key={img.id} className={cls.image}>
                  <img
                    src={img.url}
                    alt={img.name}
                    className={cls.imagePreview}
                  />
                  <button
                    onClick={() => removeImage(img.id)}
                    className={cls.imageRemove}
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <textarea
            className={cls.textArea}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask AI to change something..."
          />
          <div className={cls.aiChatFooterBottom}>
            <button
              className={clsx(cls.actionButton, {
                [cls.active]: isInspectEnabled,
              })}
              type="button"
              onClick={() => {
                isInspectEnabled ? disableInspect() : enableInspect();
              }}
            >
              <HighlightAltIcon />
            </button>
            <input
              ref={fileInputRef}
              className={cls.fileInput}
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              multiple
              style={{ display: "none" }}
            />
            <div
              className={clsx(cls.fileInputLabel, cls.actionButton)}
              onClick={handlePickClick}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className={cls.icon}>
                <AttachFileIcon fontSize="medium" htmlColor="currentColor" />
              </span>
            </div>
            <button className={cls.sendButton} type="submit">
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
