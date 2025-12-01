import cls from "./styles.module.scss";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const MultiLineView = ({ row }) => {

  const defaultValue = row?.value;

  const handleCopy = useCopyToClipboard();

  const stripHtmlTags = (input) => {
    return input.replace(/<[^>]*>/g, "");
  };

  return <div>
    <p
      id="textAreaInput"
      // onClick={(e) => handleClick(e)}
    >
      {stripHtmlTags(
        defaultValue
          ? `${defaultValue?.slice(0, 36)}${defaultValue?.length > 200 ? "..." : ""}`
          : "",
      )}
    </p>
    {
      stripHtmlTags(
        defaultValue
          ? `${defaultValue?.slice(0, 36)}${defaultValue?.length > 200 ? "..." : ""}`
          : "",
      )
    }
    <button
      className={cls.multiLineCellFormElementBtn}
      onClick={() => handleCopy(defaultValue)}
    >
      <span>
        <ContentCopyIcon style={{ width: "17px", height: "17px" }} />
      </span>
    </button>
  </div>
}
