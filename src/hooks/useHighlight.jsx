export const useHighlight = (type = "outlined") => {

  let overlay = null;

  const addHighlight = (el) => {

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "999999";
  
      if (type === "filled") {
        overlay.style.border = "2px solid #62c0ff";
        overlay.style.background = "rgba(69, 125, 255, 0.2)";
      } else {
        overlay.style.border = "2px dashed #62c0ff";
      }
      document.body.appendChild(overlay);
    }

    const rect = el.getBoundingClientRect();
    overlay.style.top = rect.top + "px";
    overlay.style.left = rect.left + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";
  }

  const removeHighlight = () => {
    overlay?.remove();
    overlay = null;
  }

  return {
    addHighlight,
    removeHighlight,
  }

}