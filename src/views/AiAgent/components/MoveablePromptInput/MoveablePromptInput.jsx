import clsx from "clsx";
import cls from "./styles.module.scss";
import { useMoveablePromptInputProps } from "./useMoveablePromptInputProps";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useEffect } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import fileService from "@/services/fileService";

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
    setSelectedContexts,
    handleRemoveContext,
    disableInspect,
    isDraggedRef,
  } = useMoveablePromptInputProps({
    generatedUiRef,
    files,
  });

  const isOpen = value.length > 40;

  const { images, handlePickClick, fileInputRef, onFileUpload, removeImage } =
    useFileUpload();

  const handleSendToServer = () => {
    const formData = new FormData();

    images.forEach((img) => {
      formData.append("files", img.file);
    });

    fileService.folderUpload(formData).then((res) => {
      console.log({ res });
    });

    // axios.post('/api/upload', formData)...
  };

  useEffect(() => {
    if (!isDragged && images.length > 0) {
      setPos((prev) => ({
        ...prev,
        y: prev.y - 100,
      }));
      isDraggedRef.current = true;
    }
  }, [images]);

  return (
    <div
      className={clsx(cls.moveablePromptInput, {
        [cls.opened]: isOpen,
        [cls.withContext]: selectedContexts.length > 0,
        [cls.imageUploaded]: images.length > 0,
      })}
      ref={boxRef}
      onPointerDown={(e) => {
        if (e.target.closest("button")) return;
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
      {selectedContexts.length > 0 && (
        <div className={cls.contexts}>
          {selectedContexts?.map((item, index) => (
            <span className={cls.badge} key={index}>
              {"<" + item.tag?.toLowerCase() + "/>"}
              <button
                className={cls.badgeClearBtn}
                onClick={() => handleRemoveContext(index)}
              />
            </span>
          ))}
        </div>
      )}
      <div className={cls.box}>
        <textarea
          ref={textareaRef}
          className={cls.textArea}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value.length > 40 && !isOpen && !isDragged) {
              setPos((prev) => ({ x: prev.x, y: prev.y - 80 }));
            }
          }}
          placeholder="Describe what you want to generate..."
        />
        <button
          className={clsx(cls.sendButton, { [cls.show]: !isOpen })}
          type="button"
          onClick={() => {
            setSelectedContexts([]);
            onSubmit({ context: selectedContexts, type: "update" });
            disableInspect(false);
          }}
          disabled={!value?.trim()}
        >
          <span className={cls.sendButtonIcon}>
            <ArrowUpwardIcon fontSize="12px" htmlColor="currentColor" />
          </span>
        </button>
      </div>
      <div className={cls.actions}>
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
          <span className={cls.sendButtonIcon}>
            <AttachFileIcon fontSize="12px" htmlColor="currentColor" />
          </span>
        </div>
        <button
          className={clsx(cls.actionButton, {
            [cls.active]: isInspectEnabled,
          })}
          type="button"
          onClick={toggleInspect}
        >
          <HighlightAltIcon />
        </button>
        <button
          className={clsx(cls.actionButton, cls.sendButtonOpened, {
            [cls.show]: isOpen,
          })}
          type="button"
          onClick={() => {
            onSubmit({ context: selectedContexts, type: "update" });
            setSelectedContexts([]);
            disableInspect(false);
          }}
          disabled={!value?.trim()}
        >
          <span className={cls.sendButtonIcon}>
            <ArrowUpwardIcon fontSize="12px" htmlColor="currentColor" />
          </span>
        </button>
      </div>
      {images?.length > 0 && (
        <div className={cls.images}>
          {images.map((img) => (
            <div key={img.id} className={cls.image}>
              <img src={img.url} alt={img.name} className={cls.imagePreview} />
              <button
                onClick={() => removeImage(img.id)}
                className={cls.imageRemove}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
