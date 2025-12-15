import { useRef, useState } from "react";

export const usePromptInputProps = () => {

  const inputRef = useRef(null)

  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim()) {
      alert("Prompt submitted: " + prompt);
    }
  };

  const recommendedPrompts = [
    "Create a modern dashboard design",
    "Generate a landing page for SaaS",
    "Design a mobile app interface",
    "Build an e-commerce product card"
  ];

  return {
    prompt,
    inputRef,
    setPrompt,
    handleSubmit,
    recommendedPrompts,
  }
}