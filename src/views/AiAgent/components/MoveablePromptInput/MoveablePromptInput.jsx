import clsx from "clsx";
import cls from "./styles.module.scss";
import { useMoveablePromptInputProps } from "./useMoveablePromptInputProps";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";

export const MoveablePromptInput = ({
  value = "",
  setValue = () => {},
  generatedUiRef,
  onSubmit = () => {},
  files = [],
}) => {

  const {
    boxRef,
    pos,
    onPointerDown,
    onPointerMove,
    stopDrag,
    textareaRef,
    setPos,
    isDragged,
    toggleInspect,
    isInspectEnabled,
    selectedContexts,
    handleRemoveContext,
  } = useMoveablePromptInputProps({ generatedUiRef, files });

  const isOpen = value.length > 40

  return <div 
    className={clsx(cls.moveablePromptInput, {[cls.opened]: isOpen, [cls.withContext]: selectedContexts.length > 0})}
    ref={boxRef}
    onPointerDown={(e) => {
      if(e.target.closest("button")) return
      onPointerDown(e);
    }}
    onPointerMove={onPointerMove}
    onPointerUp={stopDrag}
    onPointerCancel={stopDrag}
    style={{
      transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      touchAction: "none",
    }}
  >
    {
      (selectedContexts.length > 0) && <div className={cls.contexts}>
      {
        selectedContexts?.map((item, index) => (
          <span className={cls.badge} key={index}>
           {"<" + item.tag?.toLowerCase() + "/>"}
          <button className={cls.badgeClearBtn} onClick={() => handleRemoveContext(item)} />
        </span>
        ))
      }
    </div>
    }
    <div className={cls.box}>
      <textarea
        ref={textareaRef}
        className={cls.textArea}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          if(e.target.value.length > 40 && !isOpen && !isDragged) {
            setPos(prev => ({x: prev.x, y: prev.y - 80}))
          }
        }}
        placeholder="Describe what you want to generate..."
      />
      <button 
        className={clsx(cls.sendButton, {[cls.show]: !isOpen})}
        type="button"
        onClick={() => onSubmit({context: selectedContexts, type: "update"})}
        disabled={!value?.trim()}
      >
        <span className={cls.sendButtonIcon}>
          <ArrowUpwardIcon fontSize="12px" htmlColor="currentColor" />
        </span>
      </button>
    </div>
    <div className={cls.actions}>
      <button
        className={clsx(cls.actionButton, {
          [cls.active]: isInspectEnabled,
        })}
        type="button"
        onClick={toggleInspect}
      >
        <HighlightAltIcon />
      </button>
      <button className={clsx(cls.actionButton, cls.sendButtonOpened, {[cls.show]: isOpen})} type="button" onClick={() => setValue("")} disabled={!value?.trim()}>
        <span className={cls.sendButtonIcon}>
          <ArrowUpwardIcon fontSize="12px" htmlColor="currentColor" />
        </span>
      </button>
    </div>
  </div>;
};
