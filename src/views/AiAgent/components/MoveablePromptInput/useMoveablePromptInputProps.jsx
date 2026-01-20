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

  // const onElementSelect = (el) => {
  //   console.log(el)
    
  // }

  const onPointerDown = (e) => {
    const el = boxRef.current;
    if (!el) return;

    // ЛКМ или touch/pen
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const rect = el.getBoundingClientRect();

    dragRef.current.dragging = true;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.offsetX = e.clientX - rect.left;
    dragRef.current.offsetY = e.clientY - rect.top;

    // Чтобы не терять события, когда курсор выходит за элемент
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
    generatedUiRef.current.contentWindow?.postMessage(
      { type: "INSPECT_OFF" },
      "*",
    );
  };

  const toggleInspect = () => {
    if(isInspectEnabled) {
      disableInspect();
      setIsInspectEnabled(false);
    } else {
      enableInspect();
      setIsInspectEnabled(true);
    }
  };

  const handleRemoveContext = (context) => {
    setSelectedContexts(prev => prev.filter(item => (item.id || item.className) !== (context.id || context.className) && item.tag !== context.tag))
  }

  function findElementPositionInFile({
    content,
    id,
    tag,
  }) {
    const lines = content.split("\n");
  
    // 1️⃣ Самый точный способ — по id
    if (id) {
      const idPattern = new RegExp(`id=["']${id}["']`);
      for (let i = 0; i < lines.length; i++) {
        if (idPattern.test(lines[i])) {
          return {
            line: i + 1,          // Monaco: 1-based
            column: lines[i].indexOf("id=") + 1,
            reason: "id",
          };
        }
      }
    }
  
    // 2️⃣ По JSX тегу
    if (tag) {
      const tagPattern = new RegExp(`<${tag.toLowerCase()}[\\s>]`);
      for (let i = 0; i < lines.length; i++) {
        if (tagPattern.test(lines[i])) {
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
        setSelectedContexts(prev => [...prev, e.data]);
      }
      // const file = files.find((f) => f.path === inspected.filePath);

      // const pos = findElementPositionInFile({
      //   content: file.content,
      //   tag: inspected.tag,
      //   id: inspected.id,
      // });
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
    handleRemoveContext,
  };

}
