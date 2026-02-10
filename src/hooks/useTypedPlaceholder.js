import { useEffect, useState } from "react";

export function useTypedPlaceholder(
  texts = [],
  {
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseAfterTyping = 1200,
  } = {}
) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    const currentText = texts[textIndex] ?? "";

    let timeout;

    if (!isDeleting) {
      // typing
      if (charIndex < currentText.length) {
        timeout = setTimeout(() => {
          setPlaceholder(currentText.slice(0, charIndex + 1));
          setCharIndex((v) => v + 1);
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseAfterTyping);
      }
    } else {
      // deleting
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setPlaceholder(currentText.slice(0, charIndex - 1));
          setCharIndex((v) => v - 1);
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((v) => (v + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    charIndex,
    isDeleting,
    textIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseAfterTyping,
  ]);

  return placeholder;
}
