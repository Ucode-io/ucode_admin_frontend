export const PREVIEW_Refresher_SCRIPT = `
  window.addEventListener("error", (e) => {
    console.error("Preview Error:", e);
  });
`;

export const INSPECTOR_SCRIPT = `
  let overlay = null;
  let overlayTag = null;
  let enabled = false;

  function ensureOverlay() {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "999999";
      overlay.style.border = "1px dashed #62c0ff";
      
      overlayTag = document.createElement("div");
      overlayTag.style.position = "absolute";
      overlayTag.style.pointerEvents = "none";
      overlayTag.style.bottom = "calc(100% + 6px)";
      overlayTag.style.left = "0";
      overlayTag.style.padding = "2px 4px";
      overlayTag.style.borderRadius = "4px";
      overlayTag.style.backgroundColor = "#62c0ff";
      overlayTag.style.color = "#fff";
      overlayTag.style.fontSize = "12px";
      
      overlay.appendChild(overlayTag);

      document.body.appendChild(overlay);
    }
  }

  function getLabel(el) {
    let label = el.tagName.toLowerCase();
    if (el.id) label += "#" + el.id;
    if (el.classList.length) {
      label += "." + [...el.classList].slice(0, 2).join(".");
    }
    return label;
  }


  function highlight(el) {
    ensureOverlay(el);
    const rect = el.getBoundingClientRect();
    overlay.style.top = rect.top + "px";
    overlay.style.left = rect.left + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";

    if (el === document.documentElement || el === document.body) {
      overlay.style.display = "none";
      return;
    }
    overlay.style.display = "block";

    overlayTag.textContent = getLabel(el);
  }

  function clear() {
    overlay?.remove();
    overlay = null;
  }

  function getDomPath(el) {
    const path = [];
    let current = el;

    while (current && current.nodeType === 1) {
      let selector = current.tagName.toLowerCase();

      if (current.id) {
        selector += "#" + current.id;
        path.unshift(selector);
        break; // id — якорь, дальше не идём
      } else {
        const parent = current.parentElement;
        if (parent) {
          const index = Array.from(parent.children).indexOf(current) + 1;
          selector += ":nth-child(" + index + ")";
        }
      }

      path.unshift(selector);
      current = current.parentElement;
    }

    return path.join(" > ");
  }

  document.addEventListener("mouseover", (e) => {
    if (!enabled) return;
    highlight(e.target);
  }, true);

  document.addEventListener("click", (e) => {
    if (!enabled) return;
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;
    const componentRoot = target.closest("[data-path]");

    // enabled = false;
    // clear();
    // document.body.style.cursor = "default";

    window.parent.postMessage({
      type: "INSPECT_SELECT",

      tag: target.tagName,
      id: target.id || null,
      className: target.className || null,
      
      name: target.getAttribute("data-element-name") || null,

      domPath: getDomPath(target),

      filePath: componentRoot?.getAttribute("data-path") || null,
    }, "*");
  }, true);

  window.addEventListener("message", (e) => {
    if (e.data?.type === "INSPECT_ON") {
      enabled = true;
      document.body.style.cursor = "default";
    }

    if (e.data?.type === "INSPECT_OFF") {
      enabled = false;
      document.body.style.cursor = "default";
      clear();
    }
  });
`

