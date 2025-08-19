import { useState } from "react";

export const useSearchInputProps = () => {

  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return {
    text,
    handleChange
  }
};
