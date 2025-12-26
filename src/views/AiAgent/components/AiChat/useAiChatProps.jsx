import { enableInspectMode, extractNodeInfo, highlight, removeHighlight } from "@/utils/enableInspectMode";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAiChatProps = ({
  setMessages,
  messages,
  generatedUiRef,
}) => {
  const navigate = useNavigate();

  const chatBodyRef = useRef(null);
  const textAreaRef = useRef(null);
  const selectedElements = useRef([])

  const [isEmpty, setIsEmpty] = useState(!textAreaRef.current || textAreaRef.current?.innerText.trim().length === 0 || textAreaRef.current?.innerHTML === "<br>");
  const [isInspectEnabled, setIsInspectEnabled] = useState(false);


  const setInputFocus = () => {

    const el = textAreaRef.current;

    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el);

    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);

    el.focus();
  }

  const onElementSelect = (el) => {
    
    const nodeInfo = extractNodeInfo({el, target: generatedUiRef.current, getPathBy: "id"});

    const badge = document.createElement("span");
    badge.dataset.badge = "true";
    badge.id = nodeInfo.id;
    badge.textContent = `<${nodeInfo.tag} />` + `(${nodeInfo.id})`;
    badge.contentEditable = false;

    textAreaRef.current.appendChild(badge);

    selectedElements.current.push(nodeInfo.id)

    setInputFocus()
    setIsInspectEnabled(false);
    updateEmptyState()
  }

  const handleInspect = () => {
    setIsInspectEnabled(true);
    enableInspectMode(onElementSelect, generatedUiRef.current);
  }

  const handleSend = (e) => {
    e.preventDefault();
    const text = textAreaRef.current.innerHTML;
    if(!text.trim()) return;
    
    setMessages(prev => [...prev, { from: "user", text }]);
    setInputFocus();
    textAreaRef.current.innerHTML = "";

    setTimeout(() => {
      setMessages(prev => [...prev, { from: "ai", text: "Generating..." }])
    }, 1000)
  }

  const updateEmptyState = () => {
    const el = textAreaRef.current;
    if (!el) return;
  
    const hasText = el.innerText.trim().length > 0 || el.innerHTML !== "<br>";
    const hasBadges = el.querySelector("[data-badge]") !== null;
  
    setIsEmpty(!hasText && !hasBadges);
  }

  const handleInput = () => {

    const el = textAreaRef.current;

    if (!el) return;
  
    // const text = Array.from(el.childNodes)
    //   .map((node) => {
    //     if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    //     if (node.dataset?.badge) return `[[${node.textContent}]]`;
    //     return "";
    //   })
    //   .join("");
  
    updateEmptyState()
  }

  const handleKeyDown = (e) => {
    if (e.key !== "Backspace") return;
  
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
  
    const range = sel.getRangeAt(0);
  
    if (!range.collapsed) {
      const contents = range.cloneContents();
      const badge = contents.querySelector?.("[data-badge]");
      if (badge) {
        e.preventDefault();
        range.deleteContents();
        updateEmptyState();
        return;
      }
    }
  
    let node = range.startContainer;
  
    if (node.nodeType === 1 && node.dataset?.badge) {
      e.preventDefault();
      const badge = node;
      badge.remove();
      updateEmptyState();
      return;
    }
  
    if (node.nodeType === 3) {
      let prev =
        range.startOffset === 0
          ? node.previousSibling
          : null;

      if (!prev && range.startOffset > 0) return;
  
      if (prev?.dataset?.badge) {
        e.preventDefault();
        prev.remove();
        updateEmptyState();
        return;
      }
    }
  };

  const handleMouseMove = (e) => {

    removeHighlight();

    const badge = e.target;
  
    if(badge.dataset.badge) {
      const selectedNode = generatedUiRef.current.querySelector(`#${badge.id}`);

      if(!selectedNode) return;

      highlight(selectedNode, "filled");
    }
  }

  const handleMouseLeave = () => {
    removeHighlight();
  }

  const onBackClick = () => navigate("/")

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages])

  return {
    handleSend,
    chatBodyRef,
    textAreaRef,
    handleInspect,
    onBackClick,
    isEmpty,
    handleInput,
    handleKeyDown,
    isInspectEnabled,
    handleMouseMove,
    handleMouseLeave,
  }
}
