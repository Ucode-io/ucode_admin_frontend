import {useRef} from "react";

export const usePromptContainer = () => {

  const inputRef = useRef(null);

  const recommendedPrompts = [
    "Create a modern dashboard design",
    "Generate a landing page for SaaS",
    "Design a mobile app interface",
    "Build an e-commerce product card",
  ];

  return {
    recommendedPrompts,
    inputRef,
  }
}