import { useFileUpload } from "@/hooks/useFileUpload";
import { useEffect, useRef, useState } from "react";

export const useMoveablePromptInputProps = ({ generatedUiRef }) => {
  const [pos, setPos] = useState({ x: 80, y: 80 });
  const [isInspectEnabled, setIsInspectEnabled] = useState(false);

  const boxRef = useRef(null);
  const posRef = useRef(pos);

  const textareaRef = useRef(null);
  const isDraggedRef = useRef(false);

  const isDragged = isDraggedRef.current;

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

  const {
    fileInputRef,
    images = [],
    handlePickClick,
    onFileUpload,
    dragDropProps,
    onPaste,
    removeImage,
    setImages,
  } = useFileUpload();

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
    if (!isDragged && images.length > 0) {
      setPos((prev) => ({
        ...prev,
        y: prev.y - 100,
      }));
      isDraggedRef.current = true;
    }
  }, [images]);

  return {
    boxRef,
    pos,
    onPointerDown,
    onPointerMove,
    stopDrag,
    textareaRef,
    setPos,
    isDragged,
    isDraggedRef,
    toggleInspect,
    isInspectEnabled,
    disableInspect,
    fileInputRef,
    images,
    handlePickClick,
    onFileUpload,
    dragDropProps,
    onPaste,
    removeImage,
    setImages,
  };
};
