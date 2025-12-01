import { useDispatch } from "react-redux";
import { parseHTMLToText } from "../utils/parseHTMLToText";

export const useCopyToClipboard = (text, showAlert = true) => {

    const dispatch = useDispatch();

    const handleCopy = () => {
        const cleanedText = parseHTMLToText(text);

        navigator.clipboard.writeText(cleanedText);

        if(showAlert) dispatch(showAlert("Copied to clipboard", "success"));
    }

    return handleCopy
}