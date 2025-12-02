import cls from "./styles.module.scss";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const MultiLineDisplay = ({ row, handleOpenTextEditor }) => {
  const value = row?.value;

  const handleCopy = useCopyToClipboard(value);

  const stripHtmlTags = (input) => {
    return input.replace(/<[^>]*>/g, "");
  };

  return (
    <div className={cls.multilineWrapper}>
      <p
        id="textAreaInput"
        className={cls.slicedText}
        onClick={(e) => {
          handleOpenTextEditor(e, row);
        }}
      >
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
          <ContentCopyIcon style={{ width: "17px", height: "17px" }} />
        </span>
      </button>
    </div>
  );
};
