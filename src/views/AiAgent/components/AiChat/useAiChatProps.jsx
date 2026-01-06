import { useInspectMode } from "@/hooks/useInspectMode";
import cls from "./styles.module.scss";
import {
  extractNodeInfo,
  // highlight,
  // removeHighlight,
} from "@/utils/extractNodeInfo";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHighlight } from "@/hooks/useHighlight";

export const useAiChatProps = ({ setMessages, messages, generatedUiRef }) => {
  const navigate = useNavigate();

  const chatBodyRef = useRef(null);
  const textAreaRef = useRef(null);
  const selectedElements = useRef([]);

  const [isEmpty, setIsEmpty] = useState(
    !textAreaRef.current ||
      textAreaRef.current?.innerText.trim().length === 0 ||
      textAreaRef.current?.innerHTML === "<br>",
  );

  const { enableInspectMode, disableInspectMode, inspectEnabled } =
    useInspectMode({
      onSelect: onElementSelect,
      target: generatedUiRef.current,
    });

  const { addHighlight, removeHighlight } = useHighlight("filled");

  const setInputFocus = () => {
    const el = textAreaRef.current;

    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el);

    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);

    el.focus();
  };

  function onElementSelect(el) {
    setIsEmpty(false);

    const nodeInfo = extractNodeInfo({
      el,
      target: generatedUiRef.current,
      getPathBy: "id",
    });

    const clearBadge = document.createElement("span");
    clearBadge.className = cls.badgeClearBtn;
    clearBadge.dataset.clearBtn = "true";

    const badge = document.createElement("span");
    badge.className = cls.badge;
    badge.dataset.badge = "true";
    badge.id = nodeInfo.id || "";
    badge.textContent = `<${nodeInfo.tag} />` + `(${nodeInfo.id})`;
    badge.contentEditable = false;

    badge.appendChild(clearBadge);

    if (textAreaRef.current.innerHTML === "<br>") {
      textAreaRef.current.innerHTML = "";
    }

    textAreaRef.current.appendChild(badge);
    textAreaRef.current.appendChild(document.createTextNode("\u00A0"));

    selectedElements.current.push(nodeInfo.id);

    setInputFocus();
  }

  const handleInspect = () => {
    if (inspectEnabled) {
      disableInspectMode();
    } else {
      enableInspectMode();
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = textAreaRef.current.innerHTML.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInputFocus();
    textAreaRef.current.innerHTML = "";

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "ai", text: "Generating..." }]);
    }, 1000);
  };

  const updateEmptyState = () => {
    const el = textAreaRef.current;
    if (!el) return;

    const hasText = el.innerText.trim().length > 0 || el.innerHTML !== "<br>";
    const hasBadges = el.querySelector("[data-badge]") !== null;

    setIsEmpty(!hasText && !hasBadges);
  };

  const handleInput = () => {
    updateEmptyState();
  };

  const handleClick = (e) => {
    if (e.target.dataset.clearBtn) {
      textAreaRef.current.removeChild(e.target.parentElement);
    }
  };

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
      let prev = range.startOffset === 0 ? node.previousSibling : null;

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

    if (badge.dataset.badge && badge.id) {
      const selectedNode = generatedUiRef.current.querySelector(`#${badge.id}`);

      if (!selectedNode) return;

      addHighlight(selectedNode);
    }
  };

  const handleMouseLeave = () => {
    removeHighlight();
  };

  const onBackClick = () => navigate("/");

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const onMessage = (e) => {
      if (e.data?.type === "INSPECT_SELECT") {
        console.log("Selected:", e.data);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return {
    handleSend,
    chatBodyRef,
    textAreaRef,
    handleInspect,
    onBackClick,
    isEmpty,
    handleInput,
    handleKeyDown,
    isInspectEnabled: inspectEnabled,
    handleMouseMove,
    handleMouseLeave,
    handleClick,
  };
};
