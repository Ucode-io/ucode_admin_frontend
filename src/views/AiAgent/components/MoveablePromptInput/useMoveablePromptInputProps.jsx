import { useEffect, useRef, useState } from "react";

export const useMoveablePromptInputProps = ({ generatedUiRef, files }) => {
  const [pos, setPos] = useState({ x: 80, y: 80 });
  const [isInspectEnabled, setIsInspectEnabled] = useState(false);
  const [selectedContexts, setSelectedContexts] = useState([]);

  const boxRef = useRef(null);
  const posRef = useRef(pos);

  const textareaRef = useRef(null);
  const isDraggedRef = useRef(false);

  const dragRef = useRef({
    dragging: false,
    offsetX: 0,
    offsetY: 0,
    pointerId: null,
  });

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const onPointerDown = (e) => {
    const el = boxRef.current;
    if (!el) return;

    if (e.pointerType === "mouse" && e.button !== 0) return;

    const rect = el.getBoundingClientRect();

    dragRef.current.dragging = true;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.offsetX = e.clientX - rect.left;
    dragRef.current.offsetY = e.clientY - rect.top;

    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return;
    if (dragRef.current.pointerId !== e.pointerId) return;

    const el = boxRef.current;
    if (!el) return;

    const newX = e.clientX - dragRef.current.offsetX;
    const newY = e.clientY - dragRef.current.offsetY;

    // (опционально) ограничим в пределах viewport
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const maxX = window.innerWidth - w;
    const maxY = window.innerHeight - h;

    setPos({
      x: clamp(newX, 0, maxX),
      y: clamp(newY, 0, maxY),
    });

    isDraggedRef.current = true;
  };

  const stopDrag = (e) => {
    if (!dragRef.current.dragging) return;
    if (dragRef.current.pointerId !== e.pointerId) return;

    dragRef.current.dragging = false;
    dragRef.current.pointerId = null;

    const el = boxRef.current;
    try {
      el?.releasePointerCapture(e.pointerId);
    } catch (e) {
      console.error(e);
    }
  };

  const enableInspect = () => {
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

  const toggleInspect = () => {
    if (isInspectEnabled) {
      disableInspect();
      setIsInspectEnabled(false);
    } else {
      enableInspect();
      setIsInspectEnabled(true);
    }
  };

  function resolvePath(input) {
    const match = input.match(/^([a-zA-Z0-9_-]+)\.([a-z0-9-]+)$/);
    if (!match) return null;

    const [, folder, name] = match;

    const pascalName = name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    return `src/${folder}/${pascalName}.jsx`;
  }

  const handleRemoveContext = (index) => {
    setSelectedContexts((prev) => prev.filter((_, i) => i !== index));
  };

  function findElementPositionInFile({ content, id, tag }) {
    const lines = content?.split("\n");

    if (id) {
      const idPattern = new RegExp(`id=["']${id}["']`);

      if (lines?.length === 0 || !lines) return;

      for (let i = 0; i < lines.length; i++) {
        if (idPattern.test(lines[i])) {
          return {
            line: i + 1, // Monaco: 1-based
            column: lines[i].indexOf("id=") + 1,
            reason: "id",
          };
        }
      }
    }

    if (tag) {
      const tagPattern = new RegExp(`<${tag.toLowerCase()}[\\s>]`);

      if (lines?.length === 0 || !lines) return;

      for (let i = 0; i < lines?.length; i++) {
        if (tagPattern?.test(lines[i])) {
          return {
            line: i + 1,
            column: lines[i].indexOf("<") + 1,
            reason: "tag",
          };
        }
      }
    }

    // 3️⃣ Fallback — начало компонента
    for (let i = 0; i < lines.length; i++) {
      if (/function\s+\w+|const\s+\w+\s*=/.test(lines[i])) {
        return {
          line: i + 1,
          column: 1,
          reason: "component-root",
        };
      }
    }

    return null;
  }

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const w = el.offsetWidth;
    const h = el.offsetHeight;

    const x = (window.innerWidth - w) / 2;
    const y = window.innerHeight - h - 20;

    setPos({ x, y });
  }, []);

  useEffect(() => {
    const onMessage = (e) => {
      if (e.data?.type === "INSPECT_SELECT") {
        const inspected = e.data;

        const file = files?.find(
          (f) => f.path === resolvePath(inspected?.filePath),
        );

        const pos = findElementPositionInFile({
          content: file?.content,
          tag: inspected?.tag,
          id: inspected?.id,
        });

        console.log(inspected);

        setSelectedContexts((prev) => [
          ...prev,
          {
            ...pos,
            target_file: file?.path,
            tag: inspected?.tag,
            target_element_id: inspected?.id,
            code_fragment: file?.content,
            name: inspected?.name,
          },
        ]);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return {
    boxRef,
    pos,
    onPointerDown,
    onPointerMove,
    stopDrag,
    textareaRef,
    setPos,
    isDragged: isDraggedRef.current,
    toggleInspect,
    isInspectEnabled,
    selectedContexts,
    setSelectedContexts,
    handleRemoveContext,
    disableInspect,
  };
};
