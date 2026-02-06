import { useEffect, useRef, useState } from "react";

export const useAiChatProps = ({ generatedUiRef }) => {
  const chatBodyRef = useRef(null);

  const [isInspectEnabled, setIsInspectEnabled] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const enableInspect = () => {
    setIsInspectEnabled(true);
    generatedUiRef.current.contentWindow?.postMessage(
      { type: "INSPECT_ON" },
      "*",
    );
  };

  const disableInspect = () => {
    setIsInspectEnabled(false);
    generatedUiRef.current.contentWindow?.postMessage(
      { type: "INSPECT_OFF" },
      "*",
    );
  };

  return {
    messages,
    chatBodyRef,
    isInspectEnabled,
    enableInspect,
    disableInspect,
    handleSend,
  };
};
