import { useRef, useState } from "react";

const customMessages = [
  {
    from: "user",
    text: "Create a modern dashboard design and landing page for SaaS. Mobile app interface and e-commerce product card",
  },
  {
    from: "ai",
    text: "Dashboard design",
  },
  {
    from: "user",
    text: "Generate a landing page for SaaS",
  },
  {
    from: "ai",
    text: "Landing page design",
  },
  {
    from: "user",
    text: "Design a mobile app interface",
  },
  {
    from: "ai",
    text: "Mobile app interface design",
  },
  {
    from: "user",
    text: "Build an e-commerce product card",
  },
  {
    from: "ai",
    text: "E-commerce product card design",
  },
];

export const useAiAgentProps = () => {
  const generatedUiRef = useRef(null);
  const [messages, setMessages] = useState(customMessages);

  const [isChatVisible, setChatVisible] = useState(true);

  // const recommendedPrompts = [
  //   "Create a modern dashboard design",
  //   "Generate a landing page for SaaS",
  //   "Design a mobile app interface",
  //   "Build an e-commerce product card",
  // ];

  const isLoading = false;

  const handleFullScreen = () => setChatVisible(!isChatVisible);

  return {
    handleFullScreen,
    messages,
    setMessages,
    generatedUiRef,
    isChatVisible,
    isLoading,
  };
};
