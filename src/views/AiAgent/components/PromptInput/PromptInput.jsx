import { forwardRef, useEffect, useState } from "react";
import cls from "./styles.module.scss";
import { AiIcon } from "@/mock/icons";
import clsx from "clsx";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useFileUpload } from "@/hooks/useFileUpload";

const useGetDots = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return dots;
};

export const PromptInput = forwardRef(
  ({ setPrompt, prompt = "", onSubmit, isLoading }, ref) => {
    const dots = useGetDots();

    const { images, handlePickClick, fileInputRef, onFileUpload, removeImage } =
      useFileUpload();

    return (
      <div
        className={clsx(cls.promptInputWrapper, { [cls.loading]: isLoading })}
      >
        <div className={cls.promptInput}>
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
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <textarea
            value={isLoading ? `Generating your project${dots}` : prompt}
            onChange={(e) => setPrompt(e.target.value)}
            ref={ref}
            className={clsx(cls.textArea, { [cls.hasFile]: images.length > 0 })}
            placeholder="Describe what you want to generate..."
            disabled={isLoading}
          />
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
              className={clsx(cls.fileInputLabel)}
              onClick={handlePickClick}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className={cls.fileIcon}>
                <AttachFileIcon fontSize="large" htmlColor="currentColor" />
              </span>
            </div>
            <button
              className={cls.submitButton}
              type="button"
              onClick={() =>
                onSubmit({ images: images?.map((img) => img.url) })
              }
              disabled={!prompt.trim() || isLoading}
            >
              <AiIcon />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

PromptInput.displayName = "PromptInput";
