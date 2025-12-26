let inspectEnabled = false;

let overlay = null;

export function highlight(el, type) {
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "999999";

    if(type === "filled") {
      overlay.style.border = "2px solid #62c0ff";
      overlay.style.background = "rgba(69, 125, 255, 0.45)";
    } else {
      overlay.style.border = "2px dashed #62c0ff";
      overlay.style.background = "rgba(99,102,241,0.09)";
    }
    document.body.appendChild(overlay);
  }

  const rect = el.getBoundingClientRect();
  overlay.style.top = rect.top + "px";
  overlay.style.left = rect.left + "px";
  overlay.style.width = rect.width + "px";
  overlay.style.height = rect.height + "px";
}

export function removeHighlight() {
  overlay?.remove();
  overlay = null;
}

export function enableInspectMode(onSelect, target) {

  const inspectTarget = target || document;

  inspectEnabled = true;
  target.style.cursor = "pointer";

  const onMouseOver = (e) => {
    if (!inspectEnabled) return;
    const el = e.target;
    highlight(el);
  };

  const onClick = (e) => {
    if (!inspectEnabled) return;
    e.preventDefault();
    e.stopPropagation();

    inspectEnabled = false;
    target.style.cursor = "default";
    cleanup();

    onSelect(e.target);
  };

  inspectTarget.addEventListener("mouseover", onMouseOver, true);
  inspectTarget.addEventListener("click", onClick, true);

  function cleanup() {
    inspectTarget.removeEventListener("mouseover", onMouseOver, true);
    inspectTarget.removeEventListener("click", onClick, true);
    removeHighlight();
  }
}

function getDomPath(el, target, attribute = "tagName") {
  const path = [];
  let current = el;

  while (current !== target) {
    path.unshift(current[attribute].toLowerCase());
    current = current.parentElement;
  }

  return path.join(" > ");
}

export function extractNodeInfo({el, target, getPathBy = "tagName"}) {
  const currentTarget = target || document.body;
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    classes: [...el.classList],
    text: el.innerText?.slice(0, 200),
    rect: el.getBoundingClientRect(),
    dataAttrs: { ...el.dataset },
    path: getDomPath(el, currentTarget, getPathBy)
  };
}
