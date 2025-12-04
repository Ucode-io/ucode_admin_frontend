import cls from "./styles.module.scss";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const ElementMultiLine = ({ row, onClick }) => {
  const value = row?.value;

  const handleCopy = useCopyToClipboard(value);

  const stripHtmlTags = (input) => {
    return input.replace(/<[^>]*>/g, "");
  };

  return (
    <div className={cls.multilineWrapper}>
      <p id="textAreaInput" className={cls.slicedText} onClick={onClick}>
        {stripHtmlTags(
          value
            ? `${value?.slice(0, 36)}${value?.length > 200 ? "..." : ""}`
            : "",
        )}
      </p>
      <button
        className={cls.multiLineCellFormElementBtn}
        onClick={() => handleCopy(value)}
      >
        <span>
          <ContentCopyIcon style={{ width: "14px", height: "14px" }} />
        </span>
      </button>
    </div>
  );
};
