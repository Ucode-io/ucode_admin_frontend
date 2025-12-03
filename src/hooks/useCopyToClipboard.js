import { useDispatch } from "react-redux";
import { parseHTMLToText } from "../utils/parseHTMLToText";
import { showAlert } from "@/store/alert/alert.thunk";

export const useCopyToClipboard = (text, withAlert = true) => {
  const dispatch = useDispatch();

  const handleCopy = () => {
    const cleanedText = parseHTMLToText(text);

    navigator.clipboard.writeText(cleanedText);

    if (withAlert) dispatch(showAlert("Copied to clipboard", "success"));
  };

  return handleCopy;
};