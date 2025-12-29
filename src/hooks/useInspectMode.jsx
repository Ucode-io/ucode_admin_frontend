import { useEffect, useState } from "react";
import { useHighlight } from "./useHighlight";

export const useInspectMode = ({ onSelect = () => {}, target }) => {

  const { addHighlight, removeHighlight } = useHighlight();

  const [inspectEnabled, setInspectEnabled] = useState(false);

  const inspectTarget = target || document;

  const onMouseOver = (e) => {
    if (!inspectEnabled) return;
    const el = e.target;
    addHighlight(el);
  };

  const disableInspectMode = () => {
    setInspectEnabled(false);
    target.style.cursor = "default";
    cleanup();
  }

  const onClick = (e) => {
    if (!inspectEnabled) return;
    e.preventDefault();
    e.stopPropagation();

    disableInspectMode();

    onSelect(e.target);
  };

  function cleanup() {
    inspectTarget.removeEventListener("mouseover", onMouseOver, true);
    inspectTarget.removeEventListener("click", onClick, true);
    removeHighlight();
  }

  const enableInspectMode = () => {
    if(target) {
      target.style.cursor = "pointer"
    }
    inspectTarget.addEventListener("mouseover", onMouseOver, true);
    inspectTarget.addEventListener("click", onClick, true);
    setInspectEnabled(true);
  }

  useEffect(() => {

    if(inspectEnabled) {
      inspectTarget.addEventListener("mouseover", onMouseOver, true);
      inspectTarget.addEventListener("click", onClick, true);
    } else {
      cleanup();
    }

    return () => {
      cleanup();
    };

  }, [inspectEnabled]);

  return {
    inspectEnabled,
    disableInspectMode,
    enableInspectMode,
  }
}
